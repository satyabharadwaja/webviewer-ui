import React from 'react';
import { useTranslation } from 'react-i18next';
import CreatableSelect from 'react-select/creatable';
import ReactSelectCustomArrowIndicator from 'components/ReactSelectCustomArrowIndicator';
import ReactSelectWebComponentProvider from '../ReactSelectWebComponentProvider';

import './CreatableDropdown.scss';

const CreatableDropdown = ({
  onChange,
  onInputChange,
  options,
  onCreateOption,
  textPlaceholder,
  value,
  isClearable,
  isValid,
  messageText,
}) => {
  const { t } = useTranslation();

  const customStyles = {
    control: (provided, state) => {
      return {
        ...provided,
        minHeight: '28px',
        height: '36px',
        backgroundColor: 'var(--component-background)',
        borderColor: state.selectProps.isValid ? 'hsl(0, 0%, 80%)' : 'hsl(28, 80%, 52%)',
        boxShadow: null,
        '&:hover': null,
      };
    },
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--text-color)',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'var(--component-background)',
      color: 'var(--text-color)',
    }),
    option: (provided) => ({
      ...provided,
      backgroundColor: 'var(--component-background)',
      color: 'var(--text-color)',
      '&:hover': {
        backgroundColor: 'var(--popup-button-hover)',
      }
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      paddingRight: '6px',
      height: '26px',
    }),
  };

  return (
    <ReactSelectWebComponentProvider>
      <CreatableSelect
        isClearable={isClearable}
        onChange={onChange}
        onInputChange={onInputChange}
        options={options}
        onCreateOption={onCreateOption}
        placeholder={textPlaceholder}
        formatCreateLabel={(value) => `${t('action.create')} ${value}`}
        value={value}
        styles={customStyles}
        isValid={isValid}
        components={{ IndicatorsContainer: ReactSelectCustomArrowIndicator }}
      />
      {messageText ? <div className="messageText">{messageText}</div> : undefined}
    </ReactSelectWebComponentProvider>
  );
};

export default CreatableDropdown;
