// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import wechatQR from '../images/wechatNamecard-Marcus.jpg';
import '../styles/HomePage.css';
import '../fontawesome-free-6.6.0-web/css/all.min.css';

function HomePage() {
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scroll-triggered animation effect
  useEffect(() => {
    console.log('Heres Home Page');
    const frames = document.querySelectorAll('.frame');
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      frames.forEach((frame) => {
        frame.classList.add('show');
      });
    } else {
      const handleScroll = () => {
        frames.forEach((frame) => {
          const frameTop = frame.getBoundingClientRect().top;
          const frameHeight = frame.offsetHeight;
          const windowHeight = window.innerHeight;

          // Adjusted the threshold for when the frame comes into view
          if (frameTop <= windowHeight - frameHeight / 4) {
            frame.classList.add('show');
          }
        });
      };

      // Trigger the animation on load and on scroll
      handleScroll(); // Ensure frames in view on page load are displayed
      window.addEventListener('scroll', handleScroll);

      // Clean up event listener
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Modal functions
  const openModal = () => {
    setIsModalOpen(true);
    document.addEventListener('keydown', handleEsc);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.removeEventListener('keydown', handleEsc);
  };

  const handleEsc = (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  return (
    <div className="home-page">
      {/* Main title and subtitle */}
      <h1 className="main-title">欢迎来到易租屋</h1>
      <p className="sub-title">我们提供一站式租房与换汇服务，轻松便捷！</p>

      {/* Rental Services */}
      <div className="frame frame-left">
          <i className="fas fa-3x fa-home service-icon"></i>
        <h2>
          租房服务
        </h2>
        <p>我们专注于泰来大学附近的租房服务，提供各地区的推荐和详细的价位介绍。目前我们只提供泰来的房源，之后的房源会慢慢开发！</p>
        <div className="button-container">
          <a href="/properties" className="action-button">了解更多</a>
          <Link to="/locations" className="action-button">了解地区</Link>
        </div>
      </div>

      {/* Currency Exchange Services */}
      <div className="frame frame-right">
          <i className="fas fa-3x fa-exchange-alt service-icon"></i>
        <h2>
          换汇服务
        </h2>
        <p>快速提供人民币到马来西亚林吉特的换汇服务，点击下方按钮获取微信二维码。</p>
        <button className="action-button" onClick={openModal}>获取微信二维码</button>
      </div>

      {/* Upcoming Services */}
      <div className="frame frame-left">
          <i className="fas fa-3x fa-tools service-icon"></i>
        <h2>
          开发中的业务
        </h2>
        <p>敬请期待，我们即将推出更多的便利服务！</p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>扫描微信二维码</h2>
            <img src={wechatQR} alt="微信二维码" className="qr-code-img" />
            <p>请在备注中标注“汇率”</p>
            <button className="close-button" onClick={closeModal}>关闭</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
