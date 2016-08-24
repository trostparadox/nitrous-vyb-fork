import React from 'react';
import {findParent} from 'app/utils/DomUtils';
import {Dropdown} from 'react-foundation-components/lib/global/dropdown';

export default class FoundationDropdown extends React.Component {
    static propTypes = {
        show: React.PropTypes.bool.isRequired,
        children: React.PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {show: props.show};
        this.closeOnOutsideClick = this.closeOnOutsideClick.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        const show = this.state.show;
        if (show !== prevState.show) {
            if (show) document.body.addEventListener('mousedown', this.closeOnOutsideClick);
            else document.body.removeEventListener('mousedown', this.closeOnOutsideClick);
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.show !== this.props.show && newProps.show !== this.state.show) {
            this.setState({show: newProps.show});
        }
    }

    componentWillUnmount() {
        document.body.removeEventListener('mousedown', this.closeOnOutsideClick);
    }

    closeOnOutsideClick(e) {
        const inside_dropdown = findParent(e.target, 'FoundationDropdown');
        console.log('-- closeOnOutsideClick -->', e.target, inside_dropdown);
        if (!inside_dropdown) this.setState({show: false});
    };

    render() {
        if (!this.state.show) return null;
        return <Dropdown className="FoundationDropdown">{this.props.children}</Dropdown>;
    }
}
