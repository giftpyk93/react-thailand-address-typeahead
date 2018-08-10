// @flow
import React from 'react';
import { defaultProps, withState, compose, withStateHandlers, withHandlers } from 'recompose';

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
)((props: TypeaheadInputType) => {
  return (
  <div className="typeahead typeahead-input-wrap">
    <input
      onBlur={() => setTimeout(() => props.setOpen(false), 400)}
      onFocus={() => props.setOpen(true)}
      type="text" value={props.value}
      onChange={props.handleOnChange}
      onKeyDown={props.handleKeydown}
    />
    { props.options.length && props.value.length ? <input
      onChange={() => null}
      value={props.options[0][props.filterOption]}
      type="text" className="typeahead-input-hint"
    /> : null }

    {props.open && props.options.length && props.value.length ? <ul className="typeahead-selector" >
      {props.options
        .filter((item, i) => i < props.maxVisible)
        .map(
        (item, i) => (
          <li
            className={props.selectedIndex === i ? 'selected-key' : 'not-selected'}
            key={i}
            onClick={() => {
              props.onOptionSelected(item);
              props.setOpen(false);
            }}
          >{props.displayOption(item)}
          </li>))}
    </ul> : null}
  </div>
) });


export default Typeahead;
