import React from "react";
import { Button, Modal, Header, Image } from "semantic-ui-react";
const ModalComp = ({
  open,
  setOpen,
  img,
  name,
  zipcode,
  population,
  geospatialcoordinates,
  state,
  rating,
  foundationdate,
  id,
  handleDelete,
}) => {
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>City Detail</Modal.Header>
      <Modal.Content image>
        <Image size="medium" src={img} wrapped />
        <Modal.Description>
          <Header>{name}</Header>
          <p>Zipcode: {zipcode}</p>
          <p>Population: {population}</p>
          <p>Geospatial Coordinates: {geospatialcoordinates}</p>
          <p>State: {state}</p>
          <p>Rating: {rating}</p>
          <p>Foundation Date: {foundationdate}</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          color="red"
          content="Delete"
          labelPosition="right"
          icon = "checkmark"
          onClick={() => handleDelete(id)}
        >
          Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ModalComp;
