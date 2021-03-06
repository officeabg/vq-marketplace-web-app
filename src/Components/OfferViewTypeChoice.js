import React, { Component } from 'react';
import VIEW_TYPES from '../Components/VIEW_TYPES';
import ViewTypeChoice from '../Components/ViewTypeChoice';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { translate } from '../core/i18n';

export default class OfferViewTypeChoice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            viewType: props.selected
        };

        this.changeViewType = this.changeViewType.bind(this);
    }

    componentDidMount() {
        
    }

    changeViewType(viewType) {
        this.setState({
            viewType
        });

        this.props.onSelect(viewType);
    }

    render() {
        return (
            <div className="row pull-right">
                <ViewTypeChoice 
                    viewTypes={VIEW_TYPES}
                    selected={this.state.viewType}
                    changeViewType={this.changeViewType}
                />
            </div>
        )
    }
}
