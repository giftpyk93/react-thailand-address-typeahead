// @flow
import { compose, withState, withProps, lifecycle, defaultProps } from 'recompose';
import React, { Component } from 'react';
import styled from 'styled-components';
import Highlighter from 'react-highlight-words';

import Typeahead from './Typeahead.component';
import { resolveResultbyField } from './finder';

const ResultWrapper = styled.div`
  display: flex;
`;
const ResultCell = styled.div`
  display: flex;
  flex: 1;
`;
const Highlight = styled.span`
  ${props => props.highlight && `
    background-color: yellow
  `}
`;

type AddressInputType = {
  // local state
  searchStr: string;
  option: string[];

  // external props
  fieldType: string;
  value: string;
  onOptionSelected: (option: any) => void;
  renderResult: (data: any) => React.Component;
  highlighter: boolean;
}
const AddressTypeaheadComponent = (props: AddressInputType) => {
  const { searchStr, setSearchStr, fieldType, options } = props;
  if (!fieldType) {
    console.warn('No field type provide');
    return <div />;
  }
  return (
    <Typeahead
      // displayOption={props.renderResult}
      displayOption={props.computeRenderResult}
      // filterOption={fieldType}
      options={options}
      maxVisible={10}
      value={searchStr}
      onChange={e => setSearchStr(e.target.value)}
      onOptionSelected={option => props.onOptionSelected(option)}
    />
  );
};

const getHighlightedText = (text, highlight) => {
  // Split on higlight term and include term into parts, ignore case
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => (
        <Highlight key={`${i}-${part}`} highlight={part === highlight}>
          { part }
        </Highlight>
      ))}
    </span>
  );
};

const AddressTypeahead: Component<AddressInputType> = compose(
  withState('searchStr', 'setSearchStr', ''),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.props.value) {
        this.props.setSearchStr(nextProps.value);
      }
    },
  }),
  withProps(({ searchStr, fieldType }) => ({
    options: resolveResultbyField(fieldType, searchStr),
  })),
  defaultProps(({
    renderResult: data => `ต.${data.d} » อ.${data.a} » จ.${data.p}${data.z ? ` » ${data.z}` : ''}`,
    value: '',
  })),
  withProps(({ searchStr, renderResult, highlighter }) => ({
    computeRenderResult: (data) => {
      if (highlighter) {
        const result = renderResult(data);
        // const result = `ต.${data.d} » อ.${data.a} » จ.${data.p}${data.z ? ` » ${data.z}` : ''}`;
        console.log('9999999', renderResult, '0000', data, result);
        return getHighlightedText(result, searchStr);
        // return <Highlighter
        //   searchWords={[searchStr]}
        //   autoEscape={true}
        //   textToHighlight={result}
        // />
      } else {
        console.log('00000', renderResult(data));
        return renderResult(data);
      }
    },
  })),
)(AddressTypeaheadComponent);

export default AddressTypeahead;
