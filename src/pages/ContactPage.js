import React from 'react';
import '../styles/ContactPage.css';
import wechatQR from '../images/wechatNamecard.jpg';

function ContactPage() {
  return (
    <div className="contact-page">
      <h1>联系我们</h1>
      <p>我们是一家位于马来西亚的专业服务公司，专注于为中国客户提供优质的租房、换汇服务。</p>
      <p>无论您有什么问题或需求，欢迎通过以下方式联系我们。</p>

      <div className="contact-info">
        <div className="contact-details">
          <h2>联络方式</h2>
          <p><strong>电话:</strong> +60 1234 5678</p>
          <p><strong>邮箱:</strong> info@company.com</p>
        </div>

        <div className="wechat-section">
          <h2>微信客服</h2>
          <img src={wechatQR} alt="微信二维码" className="qr-code-img" />
          <p>请扫描上方二维码添加客服微信。</p>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;

