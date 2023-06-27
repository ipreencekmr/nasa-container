import React from 'react';
import PropTypes from 'prop-types';
import { loadLanguagePack, updateLocale } from '@americanexpress/one-app-ducks';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { RenderModule, composeModules } from 'holocron';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

export const NasaContainer = ({ languageData, localeName, children }) => {
  if (languageData) {
    return (
      <IntlProvider locale={localeName} messages={languageData}>
        <RenderModule moduleName="nasa-header" />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <CssBaseline />
          <Container
            component="main"
            sx={{ mt: 8, mb: 8 }}
            maxWidth={false}
            disableGutters={true}
          >
            {children}
          </Container>
        </Box>
        <RenderModule moduleName="nasa-footer" />
      </IntlProvider>
    );
  }
  return null;
};

NasaContainer.propTypes = {
  children: PropTypes.node.isRequired,
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
