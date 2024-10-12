// src/components/LocationDetails.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LocationDetails.css';
import ss15Image from '../images/ss15-condo.jpg';
import ss13Image from '../images/ss13-condo.png';
import casaImage from '../images/casatiara-condo.jpg';
import greenfieldImage from '../images/greenfield-condo.jpg';
import geolakeImage from '../images/geolake-condo.jpg';
import unionImage from '../images/union-condo.jpeg';
import edumetroImage from '../images/edumetro-condo.jpg';

function LocationDetails() {
  // Static location data including image, name, and description
  const locations = [
    {
      name: 'SS15',
      description:
        'SS15 是泰莱大学校车途径小区，距离学校直线距离约为5.1km，驾车约为12分钟可达。小区24h安保，配套游泳池健身房篮球场等。因其地处小吃街，楼下各国美食应有尽有。附近学校有：英迪大学，亚洲大学，双威大学等。附近医院有：梳邦医疗中心。',
      image: ss15Image,
    },
    {
      name: 'SS13',
      description:
        'SS13 与SS15同属一个开发商，小区建面风格类似，是SS15隔壁街区。非泰莱大学校车途径，距离莫纳什大学较近，可步行至莫纳什大学。小区配套游泳池健身房，楼下有本地餐馆以及便利店，生活便利程度完全可以保障。',
      image: ss13Image,
    },
    {
      name: 'CasaTiara',
      description:
        'Casa Tiara 可乘坐校车直达泰莱大学，直线距离约为5.9km，驾车约为14分钟。户型多为三居室和两居室，整体价格是泰莱大学周边最划算的。步行10分钟可达BIG商场和超市，周边小区密集，泰莱同学许多都会选择居住这里。',
      image: casaImage,
    },
    {
      name: 'Greenfield',
      description:
        'Greenfield 是泰莱大学校车途径小区，距离学校直线距离约为3.6km，驾车约为10分钟可达。小区24h安保，配套游泳池健身房学习室等。附近生活便利，距离双威金字塔商场仅2km，楼下有各类中餐馆以及杂货店等。附近学校有：双威国际学校、莫纳什大学、双威大学等。附近医院有：双威医疗中心。',
      image: greenfieldImage,
    },
    {
      name: 'Geolake',
      description:
        'Geolake 是同为Sunway开发商旗下的高端小区，其地理位置紧邻彼此，出小区门后就是Sunway Avenue商场，也可经此通过人行天桥直达泰莱大学。小区配套设施豪华，无边游泳池健身房学习室以及小区内绿化公园等，安保系数也是最高等级。',
      image: geolakeImage,
    },
    {
      name: 'Union',
      description:
        'Union Suites 小区距离泰莱大学仅2km，可通过人行天桥步行直达泰莱大学。小区配套设施非常好，有游泳池健身房拳击台学习室等，居住群体多为留学生。楼下即有Sunway Avenue商场，生活便利。',
      image: unionImage,
    },
    {
      name: 'Edumetro',
      description:
        'Edumetro 小区距离泰莱大学大概7km，该小区户型整体偏小，大多为一居室和两居室，适合独居或情侣租住。步行10分钟即有本地餐馆以及杂货店，性价比较高。',
      image: edumetroImage,
    }
  ];

  return (
    <div className="location-info-page">
      <h1>泰来附近租房地区介绍</h1>
      {locations.map((location, index) => (
        <div key={index} className="location-card">
          <div className="image-container">
            <img src={location.image} alt={location.name} className="location-image" />
          </div>
          <div className="location-description">
            <h2>{location.name}</h2>
            <p>{location.description}</p>
            <Link to={`/properties?search=${location.name}`} className="navigation-link">
              查看房源
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LocationDetails;
