
import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import axios from 'axios';
import toast from 'react-hot-toast';

const DropdownComponent = ({
  onOffState,
  setOn,
  getOnChangeValue,
  apiUrl,
  createApiUrl, // new prop for creating a new option
  parentId,     // id of the parent item (if applicable)
  parentField,   // the key name for the parent id in the payload (if applicable, e.g. 'department' or 'level')
  isAddOther = true 
}) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const inputRef = useRef(null); 


  useEffect(() => {
    if (showPopup && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPopup]);

  // Fetch dropdown options from API and append "Add Others +" option
  useEffect(() => {
    if (apiUrl) {
      axios
        .get(apiUrl)
        .then((res) => {
          const formatted = res.data?.data?.map((item) => ({
            value: item._id,
            label: item.name
          }));
          // Append the default "Add Others +" option
          const addOthers = isAddOther ? [...formatted, { value: 'add-others', label: 'Add Others +' }] : formatted;
          
          setOptions(addOthers);
        })
        .catch((err) => {
          console.error('Dropdown fetch error:', err);
        });
    }
  }, [apiUrl]);

  const handleChange = (option) => {
    // If the user selects "Add Others +", show the popup
    if (option.value === 'add-others') {
      setShowPopup(true);
      return;
    }
    setSelectedOption(option);
    getOnChangeValue(option.value);
    if (setOn) {
      setOn(true);
    }
  };

  const handleAddNew = () => {
    if (!newName.trim()) return;
    setIsCreating(true);

    // Build the payload. It always has the new name.
    let payload = { name: newName };
    // Conditionally add the parent id if provided.
    if (parentId && parentField) {
      payload[parentField] = parentId;
    }

  
    axios
      .post(createApiUrl, payload)
      .then((res) => {
        console.log(res)
        // Assume the response returns the newly created item
        const newItem = {
          value: res.data.data._id,
          label: res.data.data.name
        };
        // console.log(res.data.data)
        // Add the new item to the options list (before the "Add Others +" option)
        const updatedOptions = options.filter(opt => opt.value !== 'add-others');
        setOptions([...updatedOptions, newItem, { value: 'add-others', label: 'Add Others +' }]);
        // Set the new item as the selected option
        setSelectedOption(newItem);
        getOnChangeValue(newItem.value);
        if (setOn) {
          setOn(true);
        }
        // Reset the popup states
        setNewName('');
        setShowPopup(false);
      })
      .catch((err) => {
        toast.error('Failed to create new option. Please try with another name.');
        console.error('Error creating new option:', err);
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  const handleCancel = () => {
    setNewName('');
    setShowPopup(false);
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
    <div style={{ position: 'relative' }}>
      <Select
        styles={customSelectStyles}
        value={selectedOption}
        onChange={handleChange}
        options={options}
        isDisabled={!onOffState} // if false => disabled
        placeholder='Select an option'
        isSearchable={true}
      />

      {showPopup && (
        // Overlay container with backdrop blur and centered popup
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(1px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '0.375rem',
            padding: '1rem',
            width: '300px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ marginBottom: '0.5rem' }}>Enter new name:</div>
            <input
            ref={inputRef} 
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.375rem'
              }}
              placeholder="New name"
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancel}
                style={{
                  marginRight: '0.5rem',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: '#e2e8f0',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                onClick={handleAddNew}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: '#3b82f6',
                  color: '#fff',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
                disabled={isCreating}
              >
                {isCreating ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DropdownComponent;
