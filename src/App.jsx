import { useState } from 'react';
import React from 'react';


import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Image,
  Card,
  Modal,
  OverlayTrigger,
  Tooltip,
  Spinner,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [nftData, setNftData] = useState({ name: '', description: '', image: '' });
  const [xrplAddress, setXrplAddress] = useState('');
  const [xrplSecret, setXrplSecret] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setNftData({ ...nftData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file.type.match(/^image\//)) {
      setImageFile(file);
      setNftData({ ...nftData, image: URL.createObjectURL(file) });
    } else {
      setError('Only image files are allowed.');
    }
  };

  const handleMintNFT = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
  
    try {
      const formData = new FormData();
formData.append('xrplAddress', xrplAddress);
formData.append('xrplSecret', xrplSecret);
formData.append('name', nftData.name);
formData.append('description', nftData.description);

if (imageFile) {
  formData.append('image', imageFile);
}

const response = await fetch('http://127.0.0.1:5000/mint', {
  method: 'POST',
  body: formData,
});
  
      setLoading(false);
  
      if (response.ok) {
        setShowModal(true);
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  

  const RenderTooltip = React.forwardRef((props, ref) => (
    <Tooltip id="button-tooltip" {...props} ref={ref}>
      {props.text}
    </Tooltip>
  ));

  const handleReset = () => {
    setNftData({ name: '', description: '', image: '' });
    setXrplAddress('');
    setXrplSecret('');
    setError('');
    setSuccess(false);
    setLoading(false);
    setImageFile(null);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-center mb-5">
            <span role="img" aria-label="emoji">💎</span> XRPL NFT Minter
          </h1>
        </Col>
      </Row>
      <Col md={12}>
        <Card className="mb-4 shadow">
          <Card.Header className="bg-primary text-white">
            <span role="img" aria-label="emoji">🔨</span> Mint your NFT
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleMintNFT}>
              <Form.Group className="mb-3" controlId="xrplAddress">
                <Form.Label>
                  <span role="img" aria-label="emoji">💰</span> XRP Ledger Address
                </Form.Label>
                <OverlayTrigger placement="right" overlay={<RenderTooltip text="Enter your XRP Ledger address here." />}>
                  <Form.Control
                    type="text"
                    value={xrplAddress}
                    onChange={(e) => setXrplAddress(e.target.value)}
                    required
                    aria-label="XRP Ledger Address"
                    className="shadow-sm"
                  />
                </OverlayTrigger>
              </Form.Group>
              <Form.Group className="mb-3" controlId="xrplSecret">
                <Form.Label>
                  <span role="img" aria-label="emoji">🔑</span> XRP Ledger Secret
                </Form.Label>
                <OverlayTrigger placement="right" overlay={<RenderTooltip text="Enter your XRP Ledger secret here." />}>
                  <Form.Control
                    type="password"
                    value={xrplSecret}
                    onChange={(e) => setXrplSecret(e.target.value)}
                    required
                    aria-label="XRP Ledger Secret"
                    className="shadow-sm"
                  />
                </OverlayTrigger>
              </Form.Group>
              <Form.Group className="mb-3" controlId="nftName">
                <Form.Label>
                  <span role="img" aria-label="emoji">💡</span> NFT Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={nftData.name}
                  onChange={handleChange}
                  required
                  aria-label="NFT Name"
                  className="shadow-sm"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="nftDescription">
                <Form.Label>
                  <span role="img" aria-label="emoji">📄</span> NFT Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={nftData.description}
                  onChange={handleChange}
                  maxLength={500}
                  required
                  aria-label="NFT Description"
                  aria-describedby="descriptionLength"
                  className="shadow-sm"
                />
                <small className="text-muted">
                  <span id="descriptionLength">{nftData.description.length}</span>/500 characters
                </small>
              </Form.Group>
              <Form.Group className="mb-3" controlId="nftImage">
                <Form.Label>
                  <span role="img" aria-label="emoji">🖼️</span> NFT Image
                </Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  aria-label="NFT Image"
                  className="shadow-sm"
                />
              </Form.Group>
              <Button
  variant="primary"
  type="submit"
  disabled={loading}
  block="true" // corrected attribute
  className="shadow-sm"
>


                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Minting...
                  </>
                ) : (
                  'Mint NFT'
                )}
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={handleReset}
                block="true"
                className="mt-3 shadow-sm w-100"
              >

                Reset Form
              </Button>
            </Form>
            {success && (
              <Alert variant="success" className="mt-3">
                NFT minted successfully!
              </Alert>
            )}
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col md={12}>
        <Card className="shadow">
          <Card.Header className="bg-primary text-white">
            <span role="img" aria-label="emoji">🔍</span> NFT Preview
          </Card.Header>
          <Card.Body>
            {nftData.image ? (
              <Image src={nftData.image} fluid rounded alt="NFT Preview" />
            ) : (
              <p>No image selected.</p>
            )}
            <h4 className="mt-3">{nftData.name || 'NFT Name'}</h4>
            <p>{nftData.description || 'NFT Description'}</p>
          </Card.Body>
        </Card>
      </Col>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <span role="img" aria-label="emoji">🎉</span> NFT Minted Successfully
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image src={nftData.image} fluid rounded alt="Minted NFT Preview" />
          <h4 className="mt-3">{nftData.name}</h4>
          <p>{nftData.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );

}
export default App;