import React from 'react'
import { Carousel, Row, Col, Container, Card, Modal, Stack, Button, Spinner, Placeholder, Navbar, Nav, Image } from "react-bootstrap";
import { useState, useEffect } from 'react';
import axios from 'axios';
import http from '../axios_config/axios.config';
// import { Button } from 'primereact/button';
import PrebuildContext from '../contexts/prebuildContext';


export default function Home() {
  const [prebuilds, setPrebuilds] = useState([])

  const [prebuildLoading, setPrebuildLoading] = useState(false);
  const fetchPrebuilds = async () => {
    setPrebuildLoading(true);
    await http.get('/api/prebuilds').then((res) => {
        if(res.status === 200){
            setPrebuilds(res.data);
            setPrebuildLoading(false);
        }
    }).catch((err) => {
        console.error(err);
        setPrebuild(false);
    });
  }

  useEffect(() => {
    fetchPrebuilds();
  }, [])

  const [prebuild, setPrebuild] = useState([]);
  const [ShowPrebuilds, setShowPrebuilds] = useState(false);
  useEffect(() => {
    console.log("prebuild: ", prebuild);
  }, [prebuild]);

  const [category, setCategory] = useState(1);

  return (
    <div>
        <div className="h-screen">
            <Container>
                <h1 className='py-3'>Homepage</h1>
                <Row>

                </Row>
            </Container>
        </div>
        <div id="prebuilds" className="h-screen bg-white">
            <div className="py-5">
                <h1 className="text-center">Prebuilds</h1>
            </div>
            <Container fluid="md">
                <Row>
                    {
                        prebuildLoading ? (
                            <div className='flex justify-center items-center'>
                                <Spinner animation="border" role="status" className={`top-1/2 left-1/2 translate-center`}>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>

                            // <Col lg="5">
                            //     <Card style={{width : "240px"}}>
                            //         <Card.Img src=""/>
                            //         <Card.Body>
                            //             <Placeholder as={Card.Title} animation='glow'>
                            //                 <Placeholder animation='glow'/>
                            //             </Placeholder>
                            //             <Placeholder.Button variant='primary' animation='glow' xs={6}/>
                            //         </Card.Body>
                            //     </Card>
                            // </Col>
                        ) : (prebuilds?.map((prebuild, index) => (
                            <Col key={index} lg="5">
                                <Card  style={{width : "240px"}}>
                                    <Card.Img src={`data:image/png;base64,${prebuild?.image}`} variant='top'/>
                                    <Card.Body>
                                        <Card.Title>{prebuild?.name}</Card.Title>

                                        <Button onClick={() => {
                                            setShowPrebuilds(true);
                                            setPrebuild(prebuild);
                                        }}>View Items</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )))
                    }

                </Row>
            </Container>

            <ItemList prebuild={prebuild} show={ShowPrebuilds} onHide={() => {setShowPrebuilds(false)}}/>
        </div>
        <div id='items' className="h-screen bg-white">
            <div className="py-5">
                <h1 className="text-center">Items</h1>
            </div>
            <Container>
                <Navbar>
                    <Nav>
                        <Nav.Link onClick={() => {setCategory(1)}}><h3>CPU</h3></Nav.Link>
                        <Nav.Link onClick={() => {setCategory(2)}}><h3>Motherboard</h3></Nav.Link>
                        <Nav.Link onClick={() => {setCategory(3)}}><h3>RAM</h3></Nav.Link>
                        <Nav.Link onClick={() => {setCategory(4)}}><h3>SSD</h3></Nav.Link>
                        <Nav.Link onClick={() => {setCategory(5)}}><h3>HDD</h3></Nav.Link>
                        <Nav.Link onClick={() => {setCategory(6)}}><h3>GPU</h3></Nav.Link>
                    </Nav>
                </Navbar>
            </Container>
            <Items category_id={category}/>
        </div>
    </div>
  )
}


function ItemList({ prebuild, show, onHide }){
    // const
    const [prebuildItems, setPrebuildItems] = useState(null);
    return(
    <>
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <div className='col text-center'>
                    <h3>{prebuild?.name}</h3>
                </div>
            </Modal.Header>
            <Modal.Body>
                <h5 className='text-center py-2'>Item List</h5>
                <Container>
                    <Stack gap={3}>
                    <PrebuildContext.Provider value={prebuildItems}>
                        {prebuild.items?.map((item, index) => (
                            <Card key={index} className='flex flex-row bg-dark text-white'>
                                <Card.Img src={`data:image/png;base64,${item.image}`} className="m-2" style={{width: "auto", height: "120px"}}/>
                                <Card.Header>
                                    <h5>{item.item_name}</h5>
                                </Card.Header>
                            </Card>
                        ))}
                    </PrebuildContext.Provider>
                    </Stack>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => {setPrebuildItems(prebuild.items)}}>Add to Quotation</Button>
            </Modal.Footer>
        </Modal>
    </>
    );
}

function Items({ category_id }){

    const [items, setItems] = useState();
    const [loading, setloading] = useState(false);
    const fetchItems = async () => {
        setloading(true);
        await http.get('/api/items').then((res) => {
            if(res.status === 200){
                setItems(res.data);
                setloading(false);
            }
        }).catch((err) => {
            console.error(err);
            setloading(false);
        })
    }

    useEffect(() => {
        fetchItems();
    }, [])

    const [modalShow, setShow] = useState(false);
    const [targetItem, setTarget] = useState({});

    return(
        <Container fluid="md">
            <Row md="5">
            {
                loading ? (
                    <div className='flex justify-center items-center'>
                        <Spinner animation="border" role="status" className={`top-1/2 left-1/2 translate-center`}>
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    items?.filter((item) => item.category_id === category_id).map((item, index) => (
                        <Col key={index} lg="5" className='m-2'>
                            <Card style={{height: "10rem"}} className='flex flex-row'>
                                <Card.Img src={`data:image/png;base64,${item?.image}`} className='p-3' style={{width: "14rem"}} fluid/>
                                <Card.Body>
                                    <Card.Title>{item?.item_name}</Card.Title>
                                        <Button onClick={() => {
                                        setShow(true);
                                        setTarget(item)
                                        }}>View Item</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )
            }
            </Row>
            <ItemDetails item={targetItem} modalShow={modalShow} closeCallback={() => setShow(false)}/>
        </Container>
    )
}

function ItemDetails ({ item, modalShow, closeCallback }){

    const formattedDescription = item.description?.replace(/\r\n/g, '<br>');
    return(
        <Modal show={modalShow} onHide={closeCallback} size='lg'>
            <Modal.Header closeButton>
                <h5>{item.item_name}</h5>
            </Modal.Header>
            <Modal.Body>
                <div className='w-full flex flex-row justify-center items-center my-2'>
                    <Image fluid src={`data:image/png;base64,${item.image}`}/>
                </div>
                <div className='text-xl' dangerouslySetInnerHTML={{ __html: formattedDescription }} />
            </Modal.Body>
        </Modal>
    )
}
