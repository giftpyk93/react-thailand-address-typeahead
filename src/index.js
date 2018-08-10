// @flow
import React from 'react';
import { fieldsEnum } from './finder';
import AddressTypeahead from './AddressTypeahead.component';

type AddressFormInputPropType = {
    values: {
        a: string;
        d: string;
        p: string;
        z: string;
    };
    onAddressSelected: (addresObject) => void;
    renderResult: (data) => React.Component;
    highlighter: boolean;
}

class AddressForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressObj: undefined,
    };
    this.setAddressObj = this.setAddressObj.bind(this);
  }

  setAddressObj(addressObj) {
    this.setState({ addressObj });
  }
  props: AddressFormInputPropType;
  render() {
    const { addressObj } = this.state;
    return (<div>
      {
        Object.keys(fieldsEnum).map((key) => {
          let name;
          switch (fieldsEnum[key]) {
            case 'd': name = 'ตำบล'; break;
            case 'a': name = 'อำเภอ'; break;
            case 'p': name = 'จังหวัด'; break;
            case 'z': name = 'รหัสไปรษณีย์'; break;
            default: name = ''; break;
          }
          return (
            <div key={key} className="typeahead-address-container">
              <label className="typeahead-address-label" htmlFor="district">{name}</label>
              <AddressTypeahead
                renderResult={this.props.renderResult}
                onOptionSelected={(result) => {
                  this.setAddressObj(result);
                  this.props.onAddressSelected(result);
                }}
                value={addressObj ? addressObj[fieldsEnum[key]] : ''}
                fieldType={fieldsEnum[key]}
              />
            </div>
          );
        })
    }
    </div>);
  }
}

class AddressWithoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressObj: undefined,
    };
    this.setAddressObj = this.setAddressObj.bind(this);
  }

  setAddressObj(data) {
    const addressObj = this.props.withoutZ ? `ต.${data.d} อ.${data.a} จ.${data.p}` : `ต.${data.d} อ.${data.a} จ.${data.p} ${data.z || ''}`;
    this.setState({ addressObj });
  }
  props: AddressFormInputPropType;
  render() {
    const { addressObj } = this.state;
    return (
      <AddressTypeahead
        renderResult={this.props.renderResult}
        onOptionSelected={(result) => {
          this.setAddressObj(result);
          this.props.onAddressSelected(result);
        }}
        value={addressObj || ''}
        fieldType="address"
        maxVisible={this.props.maxVisible}
        highlighter={this.props.highlighter}
      />
    );
  }
}

export {
  AddressForm,
  AddressWithoutForm,
};
