import React from 'react';
import PropTypes from 'prop-types';
import { loadLanguagePack, updateLocale } from '@americanexpress/one-app-ducks';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { RenderModule, composeModules } from 'holocron';

export const NasaContainer = ({ languageData, localeName }) => {
  if (languageData) {
    return (
      <IntlProvider locale={localeName} messages={languageData}>
        <RenderModule moduleName="nasa-header" />
        <RenderModule moduleName="nasa-footer" />
      </IntlProvider>
    );
  }
  return null;
};

NasaContainer.propTypes = {
  languageData: PropTypes.shape({}).isRequired,
  localeName: PropTypes.string.isRequired,
};

export const mapDispatchToProps = (dispatch) => ({
  switchLanguage: async ({ target }) => {
    await dispatch(updateLocale(target.value));
    await dispatch(loadLanguagePack('nasa-container', { fallbackLocale: 'en-US' }));
  },
});

export const mapStateToProps = (state) => {
  const localeName = state.getIn(['intl', 'activeLocale']);
  const languagePack = state.getIn(
    ['intl', 'languagePacks', localeName, 'nasa-container'],
    fromJS({})
  ).toJS();

  return {
    languageData: languagePack && languagePack.data ? languagePack.data : {},
    localeName,
  };
};

export const loadModuleData = async ({ store: { dispatch } }) => {
  await dispatch(loadLanguagePack('nasa-container', { fallbackLocale: 'en-US' }));
  await dispatch(composeModules([
    { name: 'nasa-header' },
    { name: 'nasa-footer' },
  ]));
};

NasaContainer.holocron = {
  name: 'nasa-container',
  loadModuleData,
};

export default connect(mapStateToProps, mapDispatchToProps)(NasaContainer);
