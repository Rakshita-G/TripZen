import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { FaPlane, FaTrain, FaBus, FaCar } from 'react-icons/fa';

export const Transportation = ({ trip }) => {
  const { transportation_options = [] } = trip?.tripData || {};

  const getTransportIcon = (type) => {
    switch (type) {
      case 'flight':
        return <FaPlane className="text-primary" size={24} />;
      case 'train':
        return <FaTrain className="text-success" size={24} />;
      case 'bus':
        return <FaBus className="text-warning" size={24} />;
      case 'car':
        return <FaCar className="text-info" size={24} />;
      default:
        return <FaCar size={24} />;
    }
  };

  if (!transportation_options || transportation_options.length === 0) {
    return (
      <div className="text-center py-5">
        <h4>No transportation options available</h4>
        <p className="text-muted">We couldn't find any transportation options for this trip.</p>
      </div>
    );
  }

  return (
    <div className="transportation-container">
      <h4 className="mb-4">Recommended Transportation Options</h4>
      <Row xs={1} md={2} lg={3} className="g-4">
        {transportation_options.map((option, index) => (
          <Col key={index}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3">
                    {getTransportIcon(option.type)}
                  </div>
                  <div>
                    <Card.Title className="mb-0">{option.name}</Card.Title>
                    <small className="text-muted">{option.type.charAt(0).toUpperCase() + option.type.slice(1)}</small>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between mb-2">
                  <div>
                    <div className="text-muted small">Departure</div>
                    <div className="fw-medium">{option.departure_time}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted small">Duration</div>
                    <div className="fw-medium">{option.duration}</div>
                  </div>
                  <div className="text-end">
                    <div className="text-muted small">Arrival</div>
                    <div className="fw-medium">{option.arrival_time}</div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                  <div>
                    <span className="h5 mb-0">₹{option.price_range}</span>
                    <small className="text-muted d-block">per person</small>
                  </div>
                  {option.booking_url && (
                    <a 
                      href={option.booking_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Book Now
                    </a>
                  )}
                </div>

                {option.notes && (
                  <div className="mt-2 pt-2 border-top">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      {option.notes}
                    </small>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Transportation;
