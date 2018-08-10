// @flow
import React from 'react';
import { defaultProps, withState, compose, withStateHandlers, withHandlers } from 'recompose';
import styled, { css } from 'styled-components';

type TypeaheadInputType = {
    displayOption: () => any;
    maxVisible: number;
    value: string;
    options: any[];
    filterOptions: string;
    onChange: (e: any) => void;
    onOptionSelected: (option: any) => void;

    // local props
    open: boolean;
    setOpen: (boolean) => void;
}

const InputWrap = styled.div`
  position: relative;
  width: 100%;
`;
const TypeaheadInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: none;
  transition: 0.2s ease-in-out;
  transition-property: color, background-color, border;
  &:focus {
    outline: none;
  }
`;
const InputHint = styled.input`
  opacity: 0.3 !important;
  position: absolute;
  width: 100%;
  border: none;
  top:0;
  left:0;
  user-select: none;
  pointer-events: none;
`;
const Selector = styled.ul`
  width: 100%;
  border: 1px solid #eee;
  border-top: none;
  list-style-type: none;
  position: absolute;
  z-index: 10;
  padding: 0;
  margin: 0;
`;
const List = styled.li`
  padding: 8px 4px;
  background: #fff !important;
  border-bottom: 1px solid #eee;
  font-weight: normal;
  cursor: pointer;
  z-index: 100;
  &:hover {
      background: #f5f5f5 !important;
  }
  ${props => props.isSelected && css`background: #f5f5f5 !important;`}
`

const Typeahead: React.Component<TypeaheadInputType> = compose(
    defaultProps({
      onChange: () => { },
      option: [],
      maxVisible: 10,
    }),
    withState('open', 'setOpen', false),
    withStateHandlers({
      selectedIndex: -1,
    }, {
      handleKeydown: ({ selectedIndex }, props) => e => {
        const keyCode = e.which || e.keyCode;
        const maxLength = props.maxVisible <= props.options.length ? props.maxVisible : props.options.length
        if (keyCode === 40 && selectedIndex < maxLength - 1) {
          return ({ selectedIndex: selectedIndex + 1 });
        } else if (keyCode === 38 && selectedIndex > 0) {
          return ({ selectedIndex: selectedIndex - 1 });
        } else if (keyCode !== 40 && keyCode !== 38) {
          if (selectedIndex !== -1 && keyCode === 13) {
            props.onOptionSelected(props.options[selectedIndex]);
            props.setOpen(false);
          }
          return ({ selectedIndex: -1 });
        }
      },
    }),
    withHandlers({
      handleOnChange: props => e => {
        if (!props.open) props.setOpen(true);
        props.onChange(e);
      },
    }),
)((props: TypeaheadInputType) => (
  <InputWrap>
    <TypeaheadInput
      onBlur={() => setTimeout(() => props.setOpen(false), 400)}
      onFocus={() => props.setOpen(true)}
      type="text" value={props.value}
      onChange={props.handleOnChange}
      onKeyDown={props.handleKeydown}
    />
    { props.options.length && props.value.length ? <InputHint
      onChange={() => null}
      value={props.options[0][props.filterOption]}
      type="text"
      // className="typeahead-input-hint"
    /> : null }

    {props.open && props.options.length && props.value.length ? <Selector>
      {props.options
        .filter((item, i) => i < props.maxVisible)
        .map(
        (item, i) => (
          <List
            isSelected={props.selectedIndex === i}
            key={i}
            onClick={() => {
              props.onOptionSelected(item);
              props.setOpen(false);
            }}
          >{props.displayOption(item)}
          </List>))}
    </Selector> : null}
  </InputWrap>
));


export default Typeahead;
