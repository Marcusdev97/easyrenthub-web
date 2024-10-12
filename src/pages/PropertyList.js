// src/components/PropertyList.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchProperties } from '../utils/api'; // Fetch properties from utils/api
import '../styles/PropertyList.css';
import '../fontawesome-free-6.6.0-web/css/all.min.css';

const PropertySearch = ({ onSearch, searchValue, setSearchValue }) => {
  const [suggestions] = useState(['SS13', 'SS15', 'CasaTiara', 'IconCity', 'Greenfield', 'GeoSense', 'GeoLake', 'Union', 'Edumetro']);

  const handleSuggestionClick = (suggestion) => {
    setSearchValue(suggestion);
    onSearch(suggestion);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearch(searchValue);
    }
  };

  const handleSearchClick = () => {
    onSearch(searchValue);
  };

  return (
    <div className="search-container">
      <h1>泰来租房帮手</h1>
      <div className="search-input-container">
        <input
          type="text"
          value={searchValue}
          placeholder="输入小区或商圈开始找房咯~"
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        <button onClick={handleSearchClick} className="search-button">
          搜索
        </button>
      </div>
      <div className="suggestions-container">
        <p className="suggestion-text">为您推荐的地区：</p>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="suggestion-button"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [activeTab, setActiveTab] = useState('租房');
  const navigate = useNavigate();
  const location = useLocation();

  // Get initial search value from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const initialSearchValue = queryParams.get('search') || '';

  // State to store the search value
  const [searchValue, setSearchValue] = useState(initialSearchValue);

  // Update the URL with the new search value when navigating
  const handleSearch = (newSearchValue) => {
    navigate(`/properties?search=${encodeURIComponent(newSearchValue)}`);
  };

  // Update the searchValue state whenever the URL changes
  useEffect(() => {
    const newSearchValue = queryParams.get('search') || '';
    if (newSearchValue !== searchValue) {
      setSearchValue(newSearchValue);
    }
  }, [location.search]);

  // Fetch the properties using the utils API
  useEffect(() => {
    const fetchPropertiesData = async () => {
      try {
        const data = await fetchProperties(); // Use fetchProperties from utils/api
        setProperties(data);
        setFilteredProperties(data); // Initially show all properties
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]); // Ensure properties is an array
        setFilteredProperties([]);
      }
    };

    if (activeTab === '租房') {
      fetchPropertiesData();
    }
  }, [activeTab]);

  // Filter properties based on the search value
  useEffect(() => {
    if (searchValue && Array.isArray(properties)) {
      const filtered = properties.filter((property) =>
        property.location.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(properties);
    }
  }, [searchValue, properties]);

  // Handle property item click for navigation
  const handlePropertyClick = (id) => {
    navigate(`/properties/${id}`);
  };

  const renderImages = (images) => {
    if (!images) return null;

    // images should already be an array from the API response
    if (!Array.isArray(images) || images.length === 0) return null;

    // Use the first image in the array
    const firstImage = images[0];

    // Since images are full URLs from the API, we can use them directly
    return (
      <div className="property-image-container">
        <img
          src={firstImage}
          alt="房源图片"
          className="property-image"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop if fallback fails
            console.error('Failed to load image:', firstImage); // Log error if image fails to load
            e.target.src = '/default-image.png'; // Use a default image if loading fails
          }}
        />
      </div>
    );
  };

  const formatAvailableDate = (dateString) => {
    if (!dateString) return '日期未定';

    const date = new Date(dateString);
    const now = new Date();
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

    if (date.getFullYear() === now.getFullYear()) {
      if (date.getMonth() === now.getMonth()) {
        return `随时可入住`;
      } else {
        return `${monthNames[date.getMonth()]}房源`;
      }
    } else if (date.getFullYear() > now.getFullYear()) {
      return `明年${monthNames[date.getMonth()]}`;
    } else {
      return '已过期';
    }
  };

  return (
    <div>
      <PropertySearch onSearch={handleSearch} searchValue={searchValue} setSearchValue={setSearchValue} />

      <div className="navigation-bar">
        <button
          onClick={() => setActiveTab('租房')}
          className={activeTab === '租房' ? 'active-tab' : 'inactive-tab'}
        >
          租房
        </button>
        <button
          onClick={() => console.log('Fetching Airbnb data is not implemented yet.')}
          className="disabled-tab"
          disabled
        >
          民宿
        </button>
      </div>

      {Array.isArray(filteredProperties) && filteredProperties.length === 0 && searchValue ? (
        <div className="no-results-message">不好意思，目前已经没有这区的单位了</div>
      ) : (
        <div className="property-list">
          {Array.isArray(filteredProperties) && filteredProperties.map((property) => (
            <div key={property.id} className="property-item" onClick={() => handlePropertyClick(property.id)}>
              {renderImages(property.images)}
              <div className="property-details">
                <div className="available-date">{formatAvailableDate(property.availableDate)}</div>
                <h3 className="property-title">{property.title}</h3>
                <p className="property-info">卧室: {property.rooms} | 浴室: {property.bathrooms}</p>
                <p className="property-description">{property.description}</p>
                <div className="property-tags">
                  {property.tags && property.tags.split(';').map((tag, index) => (
                    <span key={index} className="property-tag">{tag}</span>
                  ))}
                </div>
                <p className="property-price">{property.price} 马币/月</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
