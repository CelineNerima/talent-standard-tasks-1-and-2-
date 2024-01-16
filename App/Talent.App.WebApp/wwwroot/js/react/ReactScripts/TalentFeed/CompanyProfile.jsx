import React from 'react';
import { Loader } from 'semantic-ui-react';
import Cookies from 'js-cookie';

export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {            
            employerData: {
                companyContact: {
                    email: "",
                    firstName: "",
                    lastName: "",
                    location: {
                        city: "",
                        country: ""
                    },
                    name: "",
                    phone: ""
                }
            }
        }
    }

    componentDidMount() {
        // Fetch company details from ProfileContoller
        this.getEmployerData();
    }

    getEmployerData() {
        var cookies = Cookies.get('talentAuthToken');
        // Get employer profile
        $.ajax({
            url: 'http://localhost:60290/profile/profile/getEmployerProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                let employerData = null;
                if (res.employer) {
                    let companyData = Object.assign({}, this.state.employerData, res.employer)
                    this.setState({
                        employerData: companyData
                    })
                }
            }.bind(this),
            error: function (res) {
                //alert("Unable to get employer details")
                console.log("Error on fetch:",res.status)
            }
        }) 
    }

    render() {
        const { employerData } = this.state;
        let description = "We currently do not have specific skills that we desire.";

        return (
            <div className="ui card seven wide">
                <div className="center aligned item">
                    <div className="ui tiny image" style={{ marginTop: "8px" }}>
                        <img className="ui small circular image" src={'../../../../images/images.jpg'} alt="Company Logo" />
                    </div>
                    <h4 className="title">{employerData.companyContact.name}</h4>
                    <i className="marker icon"></i>{`${employerData.companyContact.location.city},${employerData.companyContact.location.country}`}
                    <div className="description">{description}</div>
                </div>
                <div className="content">
                    <span>
                        <i className="ui phone icon"></i>:{employerData.companyContact.phone}
                        <br />
                        <i className="ui mail icon"></i>:{employerData.companyContact.email}
                    </span>
                </div>
            </div>
        )
    }
}