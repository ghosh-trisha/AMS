import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';


const DropdownComponent = ({
  onOffState,
  setOn,
  getOnChangeValue,
  apiUrl
}) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  // Fetch dropdown options from API
  useEffect(() => {

console.log("apiUrl",apiUrl);
    if (apiUrl) {
      axios
        .get(apiUrl)
        .then((res) => {

          const formatted = res.data?.data?.map((item) => ({
            value: item._id,
            label: item.name
          }));
          setOptions(formatted || []);
        })
        .catch((err) => {
          console.error('Dropdown fetch error:', err);
        });
    }
  }, [apiUrl]);

  const handleChange = (option) => {
    setSelectedOption(option);
    // Pass the selected value to parent
    getOnChangeValue(option.value);
    // console.log("test-----",option.value);
    // Enable the next dropdown in parent
    if(setOn){
        setOn(true);
    }
  };

  // Custom styles for react-select
  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderColor: '#e2e8f0',
      borderRadius: '0.375rem',
      minHeight: '40px',
      backgroundColor: onOffState ? '#ffffff' : '#f1f5f9',
      '&:hover': {
        borderColor: '#cbd5e1'
      }
    }),
    input: (base) => ({
      ...base,
      color: '#1e293b'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#94a3b8'
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '0.375rem',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
    }),
    option: (base, { isFocused }) => ({
      ...base,
      cursor: 'pointer',
      backgroundColor: isFocused ? '#f8fafc' : '#ffffff',
      color: '#1e293b',
      '&:active': {
        backgroundColor: '#f1f5f9'
      }
    })
  };

  return (
    <Select
      styles={customSelectStyles}
      value={selectedOption}
      onChange={handleChange}
      
      options={options}
      isDisabled={!onOffState} // if false => disabled
      placeholder={onOffState ? 'Select an option' : 'Select an option'}
      isSearchable={true}
    />
  );
};

export default DropdownComponent;
