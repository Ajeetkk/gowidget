// import React from "react";
// import { storiesOf, addDecorator } from "@storybook/react";
// import { action } from "@storybook/addon-actions";
// import {
//   withKnobs,
//   text,
//   select,
//   boolean,
//   object
// } from "@storybook/addon-knobs";
// import ModalPopup from "../widgets/widget-controls/modal";

// const [show, ShowPopup] = useState(false);
// const handleShow = () => ShowPopup(true);
// const handleClose = () => ShowPopup(false);

// storiesOf("Popup", module)
//   .addDecorator(withKnobs)
//   .add("button", () => (
//     <button handleShow onClick={handleShow}>
//       Modal
//     </button>
//   ))
//   .add("Primary", () => (
//     <ModalPopup
//       modalTitle="Popup title"
//       modalBtnClose="Close"
//       modalBtnSave="Save"
//     />
//   ));
// //   .add("Secondary", () => (
// //     <Button btnClass="custom-btn reset-btn" TextValue="Secondary" />
// //   ))
// //   .add("Disable", () => (
// //     <Button btnClass="custom-btn disable-btn" TextValue="Submit" />
// //   ));
