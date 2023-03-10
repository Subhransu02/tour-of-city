import React, { useState, useEffect } from "react";
import { Button, Form, Grid, Loader } from "semantic-ui-react";
import { storage, db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import { getDownloadURL } from "firebase/storage";
import { ref } from "firebase/storage";
import { uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
  doc,
  updateDoc
} from "firebase/firestore";

const initialState = {
  name: "",
  zipcode: "",
  population: "",
  geospatialcoordinates: "",
  state: "",
  rating: "",
  foundationdate: "",
};

const AddEditUser = () => {
  const [data, setData] = useState(initialState);
  const {
    name,
    zipcode,
    population,
    geospatialcoordinates,
    state,
    rating,
    foundationdate,
  } = data;
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    id && getSingleUser();
  }, [id]);

  const getSingleUser = async () => {
    const docRef = doc(db, "city", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setData({ ...snapshot.data() });
    }
  };

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused!!");
              break;
            case "running":
              console.log("Upload is running!!");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const validate = () => {
    let errors = {};
    if (!name) {
      errors.name = "Name is Required";
    }
    if (!zipcode) {
      errors.zipcode = "Zipcode is Required";
    }
    if (!population) {
      errors.population = "Population is Required";
    }
    if (!geospatialcoordinates) {
      errors.geospatialcoordinates = "Geospatial Coordinates is Required";
    }
    if (!state) {
      errors.state = "State is Required";
    }
    if (!rating) {
      errors.rating = "Rating is Required";
    }
    if (!foundationdate) {
      errors.foundationdate = "Foundation Date is Required";
    }
    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = validate();
    if (Object.keys(errors).length) return setErrors(errors);
    setIsSubmit(true);
    if(!id){
      try {
        await addDoc(collection(db, "city"), {
          ...data,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    }else{
      try {
        await updateDoc(doc(db, "city", id), {
          ...data,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    }
    navigate("/");
  };
  return (
    <div>
      <Grid
        centered
        verticalAlign="middle"
        columns={3}
        style={{ height: "80vh" }}
      >
        <Grid.Row>
          <Grid.Column textAlign="center">
            <div>
              {isSubmit ? (
                <Loader active inline="centered" size="huge" />
              ) : (
                <>
                  <h2>{id ? "Update City" : "Add City" }</h2>
                  <Form onSubmit={handleSubmit}>
                    <Form.Input
                      label="Name"
                      error={errors.name ? { content: errors.name } : null}
                      placeholder="Enter Name"
                      name="name"
                      onChange={handleChange}
                      value={name}
                      autoFocus
                    />
                    <Form.Input
                      label="Zipcode"
                      error={
                        errors.zipcode ? { content: errors.zipcode } : null
                      }
                      placeholder="Enter Zipcode"
                      name="zipcode"
                      onChange={handleChange}
                      value={zipcode}
                    />
                    <Form.Input
                      label="Population"
                      error={
                        errors.population
                          ? { content: errors.population }
                          : null
                      }
                      placeholder="Enter Population"
                      name="population"
                      onChange={handleChange}
                      value={population}
                    />
                    <Form.Input
                      label="Geospatial Coordinates"
                      error={
                        errors.geospatialcoordinates
                          ? { content: errors.geospatialcoordinates }
                          : null
                      }
                      placeholder="Enter Geospatial Coordinates"
                      name="geospatialcoordinates"
                      onChange={handleChange}
                      value={geospatialcoordinates}
                    />
                    <Form.Input
                      label="State"
                      error={errors.state ? { content: errors.state } : null}
                      placeholder="Enter State"
                      name="state"
                      onChange={handleChange}
                      value={state}
                    />
                    <Form.Input
                      label="Rating"
                      error={errors.rating ? { content: errors.rating } : null}
                      placeholder="Enter Rating"
                      name="rating"
                      onChange={handleChange}
                      value={rating}
                    />
                    <Form.Input
                      label="Foundation Date"
                      error={
                        errors.foundationdate
                          ? { content: errors.foundationdate }
                          : null
                      }
                      placeholder="Enter Foundation Date"
                      name="foundationdate"
                      onChange={handleChange}
                      value={foundationdate}
                    />
                    <Form.Input
                      label="Uplaod"
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button
                      primary
                      type="submit"
                      disabled={progress !== null && progress < 100}
                    >
                      Submit
                    </Button>
                  </Form>
                </>
              )}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default AddEditUser;
