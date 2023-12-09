import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
// import { Card } from 'primereact/card';
import { Card, Container, Row, Col, Button, Modal, ButtonGroup, InputGroup, Form, Spinner } from "react-bootstrap";
import PrebuildContext from '../contexts/prebuildContext';
import swal from 'sweetalert';

export default function QuotationPage({data}) {

    const prebuildItems = useContext(PrebuildContext)
    const [categories, setCategories] = useState();
    const [loading, toggleLoading] = useState(false);
    const fetchCategories = async () => {
      toggleLoading(true);
      await axios.get('http://hub-admin-laravel-edition.test:8080/api/categories').then((res) => {
        if(res.status === 200){
          setCategories(res.data);
          toggleLoading(false);
        }
      }).catch((err) => {
        toggleLoading(false);
        console.error(err);
      })
    }

    useEffect(() => {
      // console.log("Prebuild Items: ", prebuildItems);
    }, [prebuildItems])

    const [items, setItems] = useState();

    const [quotationItems, setQuotationItems] = useState([]);
    const [index, setIndex] = useState(0);

    const addQuotationItem = (item, quantity) => {
      //remove the target item:
      setQuotationItems(quotationItems.filter((i) => i.item.category_id !== item.category_id));
      setQuotationItems((prev) => [...prev, {item: item, quantity: quantity}]);
    }

    const removeItem = (id) => {
      setQuotationItems(quotationItems.filter((i) => i.item.category_id !== id));
    }

    const [modalState, setModalState] = useState(false);
    const [title, setTitle] = useState('');

    const addItems = (items) => {
      setModalState(true);
      setItems(items);
    }

    useEffect(() => {
      fetchCategories();
    }, [])

    useEffect(() => {
      console.log("Quotation items: " , quotationItems);
    }, [quotationItems])

    const submitQuotation = () => {
      axios.post("http://hub-admin-laravel-edition.test:8080/api/add-quotation", {
        items : quotationItems
      }).then((res) => {
        if(res.status === 200) {
          console.log(res.data);
        }
      }).catch((err) => {
        console.error(err);
      })
    }

  return loading ? (
    <Spinner animation="border" role="status" className={`fixed top-1/2 left-1/2 translate-center hidden`}>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
    ) : (
    <div className='min-h-screen bg-white'>
      <Container>
        <Row>
          <Col>
            {categories?.map((category, i) => (
                <Card key={i} className='my-3 mx-3 p-3'>
                  <h3 className='text-uppercase'>{category.category_name}</h3>
                  <Card.Body>

                    {quotationItems.find((item) => item.item.category_id === category.id) ? (
                      <>
                        <h3>{quotationItems.find((item) => item.item.category_id === category.id).item.item_name}</h3>
                        <p>Price: ₱{quotationItems.find((item) => item.item.category_id === category.id).item.bundle_price}</p>
                        <p>Quantity: {quotationItems.find((item) => item.item.category_id === category.id).quantity}</p>
                        <ButtonGroup className='mt-3'>
                          <Button variant="danger" onClick={() => {
                            removeItem(category.id);
                          }}>Remove</Button>
                          <Button variant='warning' onClick={() => {
                            addItems(category.items);
                            setTitle(category.category_name);
                          }}>Replace</Button>
                        </ButtonGroup>
                      </>
                    ) : (
                      <Button variant='primary' onClick={() => {
                        addItems(category.items)
                        setIndex(i);
                        setTitle(category.category_name)}}>
                        Add
                      </Button>
                    )}

                  </Card.Body>
                </Card>
            ))}
          </Col>
        </Row>

        <Button variant="primary" onClick={submitQuotation}>Submit Quotation</Button>
      </Container>

      <ItemModal items={items} modalState={modalState} title={title} callback={() => setModalState(false)} index={index} addCallback={addQuotationItem}/>
    </div>
  )
}

function ItemModal({items, modalState, callback, title, addCallback, index}){

  const [quantity, setQuantity] = useState({});

  const addQuantity = (q, i) => {
    setQuantity((prev) => ({...prev, [i] : q}));
  }

  useEffect(() => {
    setQuantity({});
  }, [modalState])

  return(
    <>
      <Modal show={modalState} onHide={callback} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title><h2 className='text-uppercase'>{title}</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col>
              {items?.map((item, i) => (
                <Card className='flex flex-row p-3 my-2' key={i} style={{height: "100px"}}>
                  <Card.Img src={`data:image/png;base64,${item.image}`} style={{width: "90px"}}/>
                  <Card.Body className='flex flex-row justify-between items-center'>
                    <div className='mt-2'>
                      <Card.Title>{item.item_name}</Card.Title>
                      <p>Price: ₱{item.bundle_price}</p>
                    </div>
                    <InputGroup className='w-50 mx-2'>
                      <InputGroup.Text>Quantity</InputGroup.Text>
                      <Form.Control type="number" id='quantity' value={quantity[i]} onChange={(e) => addQuantity(e.target.value, i)} />
                    </InputGroup>
                    {/* <label htmlFor='quantity'></label>
                    <input type="number" id='quantity' value={quantity[i]} onChange={(e) => addQuantity(e.target.value, i)}/> */}
                    <Button onClick={() => {

                      if(quantity[i])
                      {
                        addCallback(item, quantity[i])
                      }
                      else
                      {
                        swal({
                          text: "Please add a Quantity...",
                          icon: 'error'
                        })
                      }

                    }}>Add</Button>
                  </Card.Body>
                </Card>
              ))}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  )
}
