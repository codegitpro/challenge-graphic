import React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { SERVE_HOSTNAME, SERVE_PORT } from '../config.json';

function UrlShortner() {
  const [data, setData] = useState([]);
  const baseUrl = `//${SERVE_HOSTNAME}:${SERVE_PORT}`;
  const apiUrl = `${baseUrl}/api/links`;
  const api = axios.create({ withCredentials: true });
  const ref = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const res = await api.get(apiUrl, { withCredentials: true });
      console.log(res);
      setData(res.data.data);
    }
    fetchData();    
  });

  const shortenUrl = async (form) => {
    form.preventDefault();
    const url = ref.current.value;
    if (url.trim().length > 0) {
      await api.post(apiUrl, { url });
      ref.current.value = '';
      const res = await api.get(apiUrl);
      setData(res.data.data);
    }
  }

  const renderList = () => {
    const urls =  data || [];
    return urls.map((url, index) => (
      <tr key={url._id}>
        <td>{index + 1 }</td>
        <td>{url.originalUrl}</td>
        <td>
          <a href={`${baseUrl}/${url.urlCode}`} target="_blank">
            {`http://${SERVE_HOSTNAME}:${SERVE_PORT}/${url.urlCode}`}
          </a>
        </td>
      </tr>
    ));
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h4>Please make your URL shorten</h4>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col>
          <form onSubmit={shortenUrl}>
            <Form.Group>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Enter URL"
                  aria-label="Enter URL"
                  type="url"
                  ref={ref}
                />
                <InputGroup.Append>
                  <Button variant="primary" type="submit">Shorten</Button>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>
          </form>
        </Col>
      </Row>

      <Row>
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Original URL</th>
                <th>Shorten URL</th>
              </tr>
            </thead>
            <tbody>
              {renderList()}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default UrlShortner;