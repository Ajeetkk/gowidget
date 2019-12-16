import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  withKnobs,
  text,
  select,
  boolean,
  object
} from "@storybook/addon-knobs";
import Button from "../widgets/widget-controls/button";

const stories = storiesOf("Button", module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);

// Knobs for React props
stories.add("Primary button", () => (
  <Button
    btnClicked={boolean("Disabled", false)}
    btnClass="custom-btn primary-btn"
    TextValue={text("Label", "Hello Storybook")}
  ></Button>
));

stories.add("Secondary button", () => (
  <Button
    disabled={boolean("Disabled", false)}
    btnClass="custom-btn reset-btn"
    TextValue={text("Label", "Hello Storybook")}
  ></Button>
));

stories.add("Disable button", () => (
  <Button
    disabled={boolean("Disabled", false)}
    btnClass="custom-btn disable-btn"
    TextValue={text("Label", "Hello Storybook")}
  ></Button>
));

// storiesOf("Button", module)
//   .addDecorator(withKnobs)
//   .add(
//     "Primary",
//     () => <Button btnClass="custom-btn primary-btn" TextValue="Primary" />,
//     {
//       notes: "App primary button. Import the button and props value"
//     }
//   )
//   .add("Secondary", () => (
//     <Button btnClass="custom-btn reset-btn" TextValue="Secondary" />
//   ))
//   .add("Disable", () => (
//     <Button btnClass="custom-btn disable-btn" TextValue="Submit" />
//   ));
