import React from "react";
import { storiesOf } from "@storybook/react";
import TextBox from "../widgets/widget-controls/textBox/";

storiesOf("Text box", module)
  .add("default", () => (
    <TextBox textBoxClass="primary-textbox" placeHolder="Engine Portal" />
  ))
  .add("with classname", () => <TextBox textBoxClass="primary-textbox" />)
  .add("with placeholder", () => <TextBox placeHolder="Engine Portal" />);
