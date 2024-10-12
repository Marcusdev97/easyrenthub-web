import React, { useState, useEffect } from 'react';
import { fetchPropertyById } from '../utils/api';
import { useParams } from 'react-router-dom';
import '../styles/PropertyDetails.css';
import wechatNamecard from '../images/wechatNamecard.jpg';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await fetchPropertyById(id);
        console.log('Fetched Property Data:', data); // Debug: Log fetched property data
        setProperty(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handlers for previous and next images
  const handlePrevImage = () => {
    setSelectedImage((prevIndex) => (prevIndex === 0 ? property.images.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prevIndex) => (prevIndex === property.images.length - 1 ? 0 : prevIndex + 1));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!property) return <div>Property not found</div>;

  const formatChineseDate = (date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const availableDate = new Date(property.availableDate);
  const today = new Date();
  const displayAvailableDate = availableDate < today ? today : availableDate;

  const leaseEndDate = new Date(displayAvailableDate);
  leaseEndDate.setFullYear(leaseEndDate.getFullYear() + 1);
  leaseEndDate.setDate(leaseEndDate.getDate() - 1);

  const backendUrl = 'http://localhost:8080'; // Backend base URL for serving images

  const getFullImageUrl = (image) => {
    return image.startsWith('http')
      ? image
      : `${backendUrl.replace(/\/$/, '')}/${image.replace(/^\//, '')}`;
  };

  return (
    <div className="property-details-container">
      {/* Left section for images */}
      <div className="property-images-section">
        <div className="main-image-container">
          <img
            src={getFullImageUrl(property.images[selectedImage])}
            alt="房源图片"
            className="main-image"
            width="600"
            height="400"
          />
          {property.images.length > 1 && (
            <>
              <button className="nav-button prev-button" onClick={handlePrevImage}>
                ‹
              </button>
              <button className="nav-button next-button" onClick={handleNextImage}>
                ›
              </button>
            </>
          )}
        </div>
        <div className="thumbnail-images-container">
          {property.images.map((image, index) => (
            <div key={index} className="thumbnail-wrapper">
              <img
                src={getFullImageUrl(image)}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail-image ${selectedImage === index ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(index)}
                width="100"
                height="75"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right section for details */}
      <div className="property-info-section">
        <h1 className="property-title">{property.title || 'Property Title'}</h1>
        <p className="property-price">{property.price || 'Price Not Available'} 马币/月</p>
        <p className="property-description">{property.description || '没有什么要求'}</p>
        <div className="property-tags">
          {property.tags
            ? property.tags.split(';').map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))
            : (
                <span className="tag">没任何标签</span>
              )}
        </div>

        <div className="property-key-info">
          <div className="key-info-item">
            <p className="key-value">
              {property.rooms || 0}室 {property.bathrooms || 0}卫
            </p>
            <p className="key-label">户型</p>
          </div>
          <div className="key-info-item">
            <p className="key-value">{property.sqm || 0}m²</p>
            <p className="key-label">面积</p>
          </div>
        </div>

        {/* Agent In Charge */}
        <div className="agent-info-section">
          <div className="agent-info">
            <div className="agent-details">
              <h3>Cici</h3>
              <p>微信扫一扫直接咨询</p>
            </div>
          </div>
          <div className="qr-code">
            <img src={wechatNamecard} alt="QR Code" className="qr-code-image" />
          </div>
        </div>
      </div>

      {/* Lease Information */}
      <div className="lease-info-section">
        <h2 className="lease-info-title">租约信息</h2>
        <div className="lease-info-content">
          <div className="lease-info-row">
            <span className="lease-info-label">可入住日期</span>
            <span className="lease-info-value">{formatChineseDate(displayAvailableDate)}</span>
          </div>
          <div className="lease-info-row">
            <span className="lease-info-label">签约时长</span>
            <span className="lease-info-value">
              可长租1年 | 可签约至 {formatChineseDate(leaseEndDate)}
            </span>
          </div>
          <div className="lease-info-row">
            <span className="lease-info-label">注意事项</span>
            <span className="lease-info-value">
              <button className="modal-button" onClick={handleModalToggle}>
                租房合同签订步骤
              </button>
            </span>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleModalToggle}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>租房合同签订步骤</h2>
            <ol>
              <li>选择您感兴趣的房源，并联系房产代理了解详情。</li>
              <li>安排实地考察，亲自查看房屋状况。</li>
              <li>确认租赁意向，与房东或代理协商租金和条款。</li>
              <li>准备必要的文件，如身份证明和学生证/工作证明。</li>
              <li>签署租赁合同，支付押金和首月租金。</li>
              <li>领取钥匙，正式入住您的新家。</li>
            </ol>
            <button className="close-button" onClick={handleModalToggle}>
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;