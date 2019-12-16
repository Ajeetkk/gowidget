import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import UserComponent from "../widgets/user/user.component";



storiesOf("User Component mani", module)
  // .addDecorator(withKnobs)
  .add("data", () => (
    <UserComponent
      Url={"https://azeuw-apimhivet01.azure-api.net/api/hiveadmin/v1/ "}
    />
  ));


