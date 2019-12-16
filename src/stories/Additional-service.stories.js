import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { withKnobs, text, boolean, number } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";


import AdditionalServicePartner from "../widgets/service-partner/additional-servicepartner/additional-servicepartner.component";
import ServicePartnerService from "../widgets/service/servicepartnerservice";
import AdditionalServicePartnerView from "../widgets/service-partner/additional-servicepartner/additional-servicepartner.view";
import { Modal, Table, Button } from "../widgets/widget-controls/constants";


const CustomThemeTable = () => <AdditionalServicePartnerView />;
storiesOf("CustomTheme", module).add("Custom", () => <CustomThemeTable />);

const styles = {
  textAlign: "center",
  color: "red"
};

export const TableData = {
  id: "1",
  name: "Test Task",
  address: "TASK_INBOX",
  adress2: new Date(2018, 0, 1, 9, 0)
};


export const actions = {
  onPinTask: action("onPinTask"),
  onArchiveTask: action("onArchiveTask")
};

storiesOf("Service Partner", module)
  .addDecorator(withKnobs)
  .add("with API", () => (
    <AdditionalServicePartner
      {...actions}
      Url={"https://azeuw-apimhivet01.azure-api.net/fleet/api/v1/"}
    />
  ))
  .add("default", () => <AdditionalServicePartner />)
  .add("Custom", () => <CustomThemeTable />)
  .add("API Table", () => <Table {...TableData} />)
  .add("div", () => <div style={styles}>Content</div>)
  // .add("api", () => (
  //   <AdditionalServicePartnerView header={this.state.Header} body={this.state.Body} ServicePartnersList={this.state.LstServicePartners} />
  // ))
  
