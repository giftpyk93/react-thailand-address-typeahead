import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { withState } from 'recompose';
// import AddressTypeahead from '../src/index';
import { AddressForm, AddressWithoutForm } from '../src/index';


import '../src/styles.css';

const getHighlightedText = (text, highlight) => {
  // Split on higlight term and include term into parts, ignore case
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map(part => (
        <span key={part} style={part === highlight ? { fontWeight: 'bold' } : {}}>
          { part }
        </span>
      ))}
    </span>
  );
};

storiesOf('Component', module)
  .add('montage', () => (
    <div style={{ width: 350 }}>
      <AddressForm onAddressSelected={action('onSelectedAdress')} />
      <code>{'<AddressForm onAddressSelected={action(\'onSelectedAdress\')} />'}</code>
    </div>
  ))
  .add('handle result', () => {
    const WithStateComponent = withState('result', 'setResult', null)(({ result, setResult }) => (
      <div style={{ width: 350 }}>
        <div>
          selected : {result ? `${result.p} ${result.a} ${result.d} ${result.z}` : null}
        </div>
        <AddressForm onAddressSelected={address => setResult(address)} />
      </div>
      ));
    return (<div>
      <WithStateComponent />
      <code>
        {`
         <div style={{ width: 350 }}>
          <div>
            selected : {result ? \`\${result.p} \${result.a} \${result.d} \${result.z}\` : null}
          </div>
          <AddressForm onAddressSelected={address => setResult(address)} />
        </div>
        `}
      </code>
    </div>);
  })
  .add('custom render result', () => (
    <div style={{ width: 400 }}>
      <AddressForm
        renderResult={data => `Hi ${data.p}:${data.d} ${data.a}`}
        onAddressSelected={action('onSelectedAdress')}
      />
    </div>
  ))
  .add('address 1 input', () => (
    <div style={{ width: 400 }}>
      <AddressWithoutForm
        onAddressSelected={action('onSelectedAdress')}
      />
    </div>
  ))
  .add('custom address with highlight', () => (
    <div style={{ width: 400 }}>
      <AddressWithoutForm
        renderResult={data => `HI >> ${data.p} : ต.${data.d} อ.${data.a}`}
        onAddressSelected={action('onSelectedAdress')}
        highlighter
      />
    </div>
  ));

