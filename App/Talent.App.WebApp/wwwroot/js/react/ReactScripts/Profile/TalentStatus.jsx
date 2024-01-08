import React from 'react'
import { Form, Checkbox } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);

        const jobSeekingStatus = props.jobSeekingStatus ?
            Object.assign({}, this.props.jobSeekingStatus)
            : {
                status: "",
                availableDate: null
            }

        this.state = {
            showEditSection: false,
            statusData: jobSeekingStatus
        }
        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this) 
        this.handleChange = this.handleChange.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit() {
        const data = Object.assign({}, this.props.jobSeekingStatus);
        this.setState({
            showEditSection: true,
            statusData:data
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.statusData);
        data[event.target.name] = event.target.value
        this.setState({
            statusData: data
        })
    }

    renderEdit() {        
        return (
            <div className="ui sixteen wide column">
                <div className="form">
                    <Form>
                     <Checkbox>

                    </Checkbox>
                    </Form>
                </div>
            </div>
        )
    }

    renderDisplay() {
        return (
            <div className="row">
                <div className="ui sixteen wide column">
                    <p>Current Status: {this.props.jobSeekingStatus.status}</p>
               </div>
            </div>
        )
    }
    
    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }
}