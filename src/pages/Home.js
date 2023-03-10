import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { Button, Card, Grid, Container, Image } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { collection, deleteDoc, onSnapshot , doc} from "firebase/firestore";
import ModalComp from "../components/ModalComp";
import Spinner from "../components/Spinner";
const Home = () => {
  const [city, setCity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      collection(db, "city"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setCity(list);
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  if(loading){
    return <Spinner />
  }

  const handleModal = (item) => {
    setOpen(true);
    setUser(item);
  };

  const handleDelete = async(id) => {
    if(window.confirm("Are you sure to delete this city ?")){
      try{
        setOpen(false);
        await deleteDoc(doc(db, "city", id));
        setCity(city.filter((user) => user.id !== id));
      }catch(err){
        console.log(err);
      }
    }
  };


  return (
    <Container>
        <Grid columns={3} stackable>
          {city &&
            city.map((item) => (
              <Grid.Column key={item.id}>
                <Card>
                  <Card.Content>
                    <Image
                      src={item.img}
                      size="medium"
                      style={{
                        height: "150px",
                        width: "150px",
                        borderRadius: "50%",
                      }}
                    />
                    <Card.Header style={{ marginTop: "20px" }}>
                      {item.name}
                    </Card.Header>
                    <Card.Description>{item.state}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <div>
                      <Button
                        color="green"
                        onClick={() => navigate(`/update/${item.id}`)}
                      >
                        Update
                      </Button>
                      <Button color="purple" onClick={() => handleModal(item)}>
                        View
                      </Button>
                      {open && (
                        <ModalComp
                          open={open}
                          setOpen={setOpen}
                          handleDelete={handleDelete}
                          {...user}
                        />
                      )}
                    </div>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))}
        </Grid>
    </Container>
  );
};

export default Home;
