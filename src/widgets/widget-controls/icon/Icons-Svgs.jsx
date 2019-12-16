import React from "react";
import IconList from "../../../assets/IconList";

export default function Icons(props) {
  const deleteIcon = () => {
    return (
      <svg
        version="1.1"
        id="deleteIcon"
        x="0px"
        y="0px"
        width="16px"
        height="16px"
        viewBox="0 0 16 16"
        enableBackground="new 0 0 16 16"
      >
        <path d={IconList.Delete} />
      </svg>
    );
  };

  const reloadIcon = () => {
    return (
      <svg
        version="1.1"
        x="0px"
        y="0px"
        width="18px"
        height="17px"
        viewBox="0 0 18 17"
        enableBackground="new 0 0 18 17"
      >
        <path strokeWidth="0.2" d={IconList.Reload} />
      </svg>
    );
  };

  const revokeIcon = () => {
    return (
      <svg
        version="1.1"
        x="0px"
        y="0px"
        width="16px"
        height="16px"
        viewBox="0 0 16 16"
      >
        <path d={IconList.Not_allowed} />
      </svg>
    );
  };
  const mapIcon = () => {
    return (
      <svg
        width="20px"
        height="28px"
        viewBox="0 0 20 28"
        version="1.1"
        enableBackground="new 0 0 16 16"
      >
        <path style={{ fill: "#00c6aa" }} d={IconList.Map_Icon} />
      </svg>
    );
  };
  const callIcon = () => {
    return (
      <svg
        width="35px"
        height="28px"
        viewBox="0 0 20 28"
        version="1.1"
        enableBackground="new 0 0 16 16"
      >
        <path style={{ fill: "#00c6aa" }} d={IconList.Call_Icon} />
      </svg>
    );
  };

  const editIcon = () => {
    return (
      <svg version="1.1" x="0px" y="0px" id="editIcon"
        width="16px" height="16px" viewBox="0 0 16 16" enableBackground="new 0 0 16 16">
        <path d={IconList.Edit} />
      </svg>
    )
  };

  const searchIcon = () => {
    return (
      <svg version="1.1" x="0px" y="0px"
        width="18px" height="17px" viewBox="0 0 18 17" enableBackground="new 0 0 18 17">
        <path d={IconList.Search} />
      </svg>
    )
  };

  const closeIcon = () => {
    return (
      <svg version="1.1" x="0px" y="0px"
        width="18px" height="17px" viewBox="0 0 18 17" enableBackground="new 0 0 18 17">
        <path d={IconList.Search_Close} />
      </svg>
    )
  };

  const FilterIcon = () => {
    return (
      <svg version="1.1" x="0px" y="0px"
        width="18px" height="17px" viewBox="0 0 18 17" enableBackground="new 0 0 18 17">
        <path d={IconList.Filter_Icon} />
      </svg>
    )
  };

  const tagClose = () => {
    return (
      <svg version="1.1" x="0px" y="0px" width="10px"
        height="10px" viewBox="0 0 10 10" enableBackground="new 0 0 10 10">
        <path d={IconList.Tag_close} />
      </svg>
    )
  };

  const paginnationLeftArrow = () => {
    return (
      <svg version="1.1" x="0px" y="0px"
        width="7px" height="10px" viewBox="0 0 7 10" enableBackground="new 0 0 7 10">
        <path d={IconList.Pagination_left} />
      </svg>
    )
  };
  const collapseIcon = () => {
    return (
      <svg version="1.1" x="0px" y="0px"
        width="25px" height="15px" viewBox="0 0 25 15" enableBackground="new 0 0 25 15">
        <path d={IconList.Collapse} />
      </svg>
    )
  };
  const collapseRevIcon = () => {
    return (
      <svg version="1.1" x="0px" y="0px"
        width="25px" height="15px" viewBox="0 0 25 15" enableBackground="new 0 0 25 15">
        <path d={IconList.Collapse_rev} />
      </svg>
    )
  };

  const AssignTextIcon = () => {
    return (
      <span style={{	height: '18px',	width: '43.52px',	color: '#3B64D6',	'font-family': 'Roboto',	'font-size': '14px',	'line-height': '18px', cursor: 'pointer'}}>Assign</span>
    )
  };

  const selectIcon = () => {
    switch (props.IconName) {
      case 'deleteIcon':
        return (<React.Fragment>{deleteIcon()}</React.Fragment>);
      case 'reloadIcon':
        return (<React.Fragment>{reloadIcon()}</React.Fragment>);
      case 'revokeIcon':
        return (<React.Fragment>{revokeIcon()}</React.Fragment>);
      case 'editIcon':
        return (<React.Fragment>{editIcon()}</React.Fragment>);
      case 'assignTextIcon':
        return (<React.Fragment>{AssignTextIcon()}</React.Fragment>);
      case 'searchIcon':
        return (<React.Fragment>{searchIcon()}</React.Fragment>);
      case 'mapIcon':
        return (<React.Fragment>{mapIcon()}</React.Fragment>);
      case 'callIcon':
        return (<React.Fragment>{callIcon()}</React.Fragment>);
      case 'closeIcon':
        return (<React.Fragment>{closeIcon()}</React.Fragment>);
      case 'Filter-Icon':
        return (<React.Fragment>{FilterIcon()}</React.Fragment>);
      case 'Tag-close':
        return (<React.Fragment>{tagClose()}</React.Fragment>);
      case 'Pagination-arrow':
        return (<React.Fragment>{paginnationLeftArrow()}</React.Fragment>);
      case 'collapseIcon':
        return (<React.Fragment>{collapseIcon()}</React.Fragment>);
      case 'collapseRevIcon':
        return (<React.Fragment>{collapseRevIcon()}</React.Fragment>);

      default:
        return (<React.Fragment> </React.Fragment>)
    }

  };
  return <React.Fragment>{selectIcon()}</React.Fragment>;
}
