import React, { Component } from 'react'
import './user.scss';
import UserService from '../service/userservice';
import AssignRole from './user.assignrole';


function contentEditable(WrappedComponent) {
    return class extends React.Component {
        state = {
            editing: false
        }

        toggleEdit = (e) => {
            e.stopPropagation();
            if (this.state.editing) {
                this.cancel();
            } else {
                this.edit();
            }
        };

        edit = () => {
            this.setState({
                editing: true
            }, () => {
                this.domElm.focus();
            });
        };

        save = () => {
            this.setState({
                editing: false
            }, () => {
                if (this.props.onSave && this.isValueChanged()) {
                    console.log('Value is changed', this.domElm.textContent);
                }
            });

            this.props.sendback(this.domElm.textContent, this.props.ind);
        };

        cancel = () => {
            this.setState({
                editing: false
            });
        };

        isValueChanged = () => {
            return this.props.value !== this.domElm.textContent
        };

        handleKeyDown = (e) => {
            const { key } = e;
            switch (key) {
                case 'Enter':
                case ';':
                case '':
                    this.save();
                    break;
            }
        };

        render() {
            let editOnClick = true;
            const { editing } = this.state;
            if (this.props.editOnClick !== undefined) {
                editOnClick = this.props.editOnClick;
            }
            return (
                <WrappedComponent
                    className={editing ? 'editing' : ''}
                    onClick={editOnClick ? this.toggleEdit : undefined}
                    contentEditable={editing}
                    ref={(domNode) => {
                        this.domElm = domNode;
                    }}
                    suppressContentEditableWarning={true}
                    onBlur={this.save}
                    onKeyDown={this.handleKeyDown}
                    {...this.props}
                >
                    {this.props.value}
                </WrappedComponent>
            )
        }
    }
}

export default class MultiEmailBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            roles: []
        };
        this.userService = new UserService('https://azeuw-apimhived01.azure-api.net/api/v1');
        this.IsInvalidEmail = false;
        this.EmailErrorText = '';
        this.emailsFromDb = [];
        this.validMailClasses = [];
    }

    componentDidMount() {
        this.prepareRole();
    }

    prepareRole = () => {
        const lstRole = [];
        this.props.FilterData[0].forEach(data => {
            lstRole.push({ id: data.id, name: data.name, active: false })
        });
        this.state.roles = lstRole;
        this.setState({ "roles": this.state.roles });

    };

    test = (emailId, i) => {
        // Cheking duplications
        if (this.state.tags.find(tag => tag.toLowerCase() === emailId.toLowerCase())) {
            this.tagInput.value = '';
            return;
        }

        if (emailId === '') {
            this.removeTag(i);
            return;
        }

        let tag = this.state.tags;
        tag[i] = emailId;
        this.setState({ tags: tag });

        const isValid = this.emailVerification(emailId);
        if (isValid) {
            this.IsInvalidEmail = false;
            this.props.ValidateEmail(this.IsInvalidEmail, this.EmailErrorText, this.state.tags);
            this.getEmailFromDb();
        } else {
            this.IsInvalidEmail = true;
            this.EmailErrorText = 'Invalid Email Format'
            this.props.ValidateEmail(this.IsInvalidEmail, this.EmailErrorText, this.state.tags);
        }
    };

    removeTag = (i) => {
        const newTags = this.state.tags;
        newTags.splice(i, 1);
        this.setState({ tags: newTags });
        this.IsInvalidEmail = false;
        if (this.state.tags.length > 0) {
            // Remove from db email 
            const ind = this.emailsFromDb.indexOf(this.state.tags[i]);
            this.emailsFromDb.splice(ind, 1);

            // checking validations
            if (!this.IsInvalidEmail) {
                this.getEmailFromDb();
            }
        } else {
            this.IsInvalidEmail = true;
            this.EmailErrorText = 'Email Required';
            this.props.ValidateEmail(this.IsInvalidEmail, this.EmailErrorText, this.state.tags);
        }
    }

    inputKeyDown = (e) => {
        const emailId = e.target.value;
        if ((e.key === 'Enter' || e.key === ';' || e.key === ' ') && emailId) {
            // Preventing append keys
            e.preventDefault();
            e.stopPropagation();

            // Cheking duplications
            if (this.state.tags.find(tag => tag.toLowerCase() === emailId.toLowerCase())) {
                this.tagInput.value = '';
                return;
            }

            if (this.state.tags.length === 10) {
                this.IsInvalidEmail = true;
                this.EmailErrorText = 'Maximum 10 emails';
                this.props.ValidateEmail(this.IsInvalidEmail, this.EmailErrorText, this.state.tags);
                this.tagInput.value = '';
                return;
            }

            // Verify email
            if (!this.IsInvalidEmail) {
                this.createControl(emailId, false);
            } else {
                const isValid = this.emailVerification(emailId);
                if (isValid) {
                    this.IsInvalidEmail = false;
                    this.props.ValidateEmail(this.IsInvalidEmail, this.EmailErrorText, this.state.tags);
                    this.createControl(emailId, false);
                }
            }
        } else if (e.key === 'Backspace' && !emailId) {
            this.removeTag(this.state.tags.length - 1);
        }
    }

    onPaste = (evt) => {
        evt.preventDefault();
        var paste = evt.clipboardData.getData("text");
        var array = paste.split(';', 1);
        if (array.length > 0) {
            this.tagInput.value = array[0];
            this.createControl(this.tagInput.value, false);
        } else {
            var array = paste.split(' ', 1);
            if (array.length > 0) {
                this.tagInput.value = array[0];
                this.createControl(this.tagInput.value, false);
            }
        }
    }

    createControl(emailId, isFocusOut) {
        const isValid = this.emailVerification(emailId);
        if (isValid) {
            let emails = this.state.tags;
            emails.push(emailId);
            this.setState({ tags: emails });
            this.tagInput.value = null;
            if (isFocusOut) {
                this.getEmailFromDb();
            }
        }
    }

    emailValidation(email) {
        const regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        const result = email.replace(/\s/g, '').split(/,|;/);
        for (const i of result) {
            if (!regex.test(i)) {
                return false;
            }
        }
        return true;
    }

    emailVerification(emailId) {
        const isValid = this.emailValidation(emailId);
        if (!isValid) {
            this.IsInvalidEmail = true;
            this.EmailErrorText = 'Invalid Email Format';
            this.props.ValidateEmail(this.IsInvalidEmail, this.EmailErrorText, this.state.tags);
        }
        return isValid;
    }

    verifyNewEmail(lstEmails) {
        if (this.emailsFromDb.length > 0) {
            const lstNewEmails = [];
            lstEmails.forEach(x => {
                const email = this.emailsFromDb.filter(y => y === x);
                if (email !== undefined || email !== null) {
                    if (email.length === 0) {
                        lstNewEmails.push(x);
                    }
                }
            });
            if (lstNewEmails.length > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    getEmailFromDb(): void {
        if (!this.IsInvalidEmail) {
            if (this.state.tags.length === 0) {
                this.IsInvalidEmail = true;
                this.EmailErrorText = 'Atlease 1 email required';
                this.props.ValidateEmail(this.IsInvalidEmail, this.EmailErrorText, this.state.tags);
            } else {
                const isNew = this.verifyNewEmail(this.state.tags);
                if (isNew) {
                    let emailIds = [];
                    this.IsInvalidEmail = false;
                    this.state.tags.forEach(x => {
                        emailIds.push(x.trim());
                    });
                    let emailData = {
                        emailIds: emailIds
                    }


                    // Calling api
                    this.userService.validateInviteUser(emailData).then(data => {
                        // this.emailsFromDb = [];
                        // this.state.tags.forEach(x => {
                        //     this.emailsFromDb.push(x.toLowerCase);
                        // });
                        this.state.tags.forEach(x => {
                            const email = data.data.filter(y => y.emailId.toLowerCase() === x.toLowerCase());
                            this.emailsFromDb.push(x.toLowerCase);
                            if (email !== null || email !== undefined) {
                                if (!email[0].isValid) {
                                    this.validMailClasses.push('error');
                                } else {
                                    this.validMailClasses.push('sucess');
                                }
                            }
                        });

                        const emailLen = data.data.filter(y => y.isValid === false);
                        if (emailLen.length > 0) {
                            this.IsInvalidEmail = true;
                            this.EmailErrorText = 'The highlighted email address(es) is / are already registered in the application.Please remove them to continue.';
                            this.props.ValidateEmail(this.IsInvalidEmail, this.EmailErrorText, this.state.tags);
                        } else {
                            this.IsInvalidEmail = false;
                        }
                    });
                }
            }
        }
    }

    focusOut = (e) => {
        const emailId = e.target.value;
        // Cheking duplications
        if (this.state.tags.find(tag => tag.toLowerCase() === emailId.toLowerCase())) {
            this.tagInput.value = '';
            this.IsInvalidEmail = false;
            this.props.ValidateEmail(this.IsInvalidEmail, this.EmailErrorText, this.state.tags);
            return;
        }
        if (emailId.trim() !== '') {
            const isValid = this.emailVerification(emailId);
            if (isValid) {
                this.IsInvalidEmail = false;
                this.props.ValidateEmail(this.IsInvalidEmail, this.EmailErrorText, this.state.tags);
                this.createControl(emailId, true);
            } else {
                this.createControl(emailId, false);
            }
        } else {
            if (!this.IsInvalidEmail) {
                if (this.state.tags.length === 0) {
                    this.IsInvalidEmail = true;
                    this.EmailErrorText = 'Email Required';
                    this.props.ValidateEmail(this.IsInvalidEmail, this.EmailErrorText, this.state.tags);
                } else {
                    this.IsInvalidEmail = false;
                    this.getEmailFromDb();
                    this.props.ValidateEmail(this.IsInvalidEmail, this.EmailErrorText, this.state.tags);
                }
            } else {
                if (this.state.tags.length > 0 && emailId.trim() === '') {
                    this.IsInvalidEmail = false;
                    this.getEmailFromDb();
                    this.props.ValidateEmail(this.IsInvalidEmail, this.EmailErrorText, this.state.tags);
                }
            }
        }
    }

    SelectedRole = (ids) => {
        this.props.SelectedRole(ids);
    }

    render() {
        const { tags } = this.state;
        let EditableDIV = contentEditable('li');
        let EditableH1 = contentEditable('span');
        return (
            <React.Fragment>
                <p className="formLabel">Email address(es)</p>
                <div className="input-tag">
                    <ul className="input-tag__tags">
                        {tags.map((tag, i) => (
                            <li key={tag} >
                                <EditableH1 value={tag} sendback={this.test} ind={i} />
                                <button type="button" onClick={() => { this.removeTag(i); }}></button>
                            </li>
                        ))}
                        <li className="input-tag__tags__input"><input type="text" className="no-border" onKeyDown={this.inputKeyDown} onPaste={this.onPaste} onBlur={this.focusOut} ref={c => { this.tagInput = c; }} /></li>
                    </ul>
                </div>
                {this.IsInvalidEmail ? <div className="alert alert-danger"> {this.EmailErrorText} </div> : null}

                <h3>Assign role :</h3>
                <AssignRole roles={this.props.FilterData} SelectedRole={this.SelectedRole} />
            </React.Fragment>
        )
    }
}


