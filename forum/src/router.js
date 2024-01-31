import * as React from 'react';
import PropTypes from 'prop-types';
import {BrowserRouter, Link as RouterLink} from 'react-router-dom';
import {StaticRouter} from 'react-router-dom/server';

export const LinkBehavior = React.forwardRef((props, ref) => {
    const {href, ...other} = props;
    return <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />;
});

LinkBehavior.propTypes = {
    href: PropTypes.oneOfType([
        PropTypes.shape({
            hash: PropTypes.string,
            pathname: PropTypes.string,
            search: PropTypes.string,
        }),
        PropTypes.string,
    ]).isRequired,
};

export function Router(props) {
    const {children} = props;
    if (typeof window === 'undefined') {
        return <StaticRouter location="/">{children}</StaticRouter>;
    }

    return <BrowserRouter>{children}</BrowserRouter>;
}

Router.propTypes = {
    children: PropTypes.node,
};

export default Router;