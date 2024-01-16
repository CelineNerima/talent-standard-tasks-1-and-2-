import React from 'react';
import Cookies from 'js-cookie';
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Loader } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';

export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData;
        loader.allowedUsers.push('Employer');
        loader.allowedUsers.push('Recruiter');

        this.state = {
            employerData: {
                companyContact: {
                    email: '',
                    firstName: '',
                    lastName: '',
                    location: {
                        city: '',
                        country: '',
                    },
                    name: '',
                    phone: '',
                },
            },
            loadNumber: 5,
            loadPosition: 0,
            feedData: [],
            talentList: [],
            watchlist: [],
            loaderData: loader,
            loadingFeedData: false,
            loadingTalentList: false,
            companyDetails: null,
            lastLoadPosition: 0,
            isGreaterThanLoadNumber: true,
        };

        this.init = this.init.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.updateTalentList = this.updateTalentList.bind(this);
        this.getTalentList = this.getTalentList.bind(this);
    }

    componentDidMount() {
        this.init();
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData);
        loaderData.isLoading = false;
        this.setState({ loaderData });
        this.getTalentList(() => this.setState({ loaderData }));
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        if (!this.state.isGreaterThanLoadNumber) {
            return;
        }

        const wrappedElement = document.getElementById('talentCard');

        // Check if wrappedElement is not null before accessing its properties
        if (wrappedElement) {
            if (wrappedElement.getBoundingClientRect().bottom <= window.innerHeight) {
                console.log('header bottom reached', wrappedElement.getBoundingClientRect().bottom, window.innerHeight);
                let loader = TalentUtil.deepCopy(this.state.loaderData);
                loader.isLoading = false;
                this.setState({
                    loadPosition: this.state.loadPosition + 1,
                });
                if (this.state.loadPosition > this.state.lastLoadPosition) {
                    this.getTalentList(() => {
                        this.setState({
                            loaderData,
                            lastLoadPosition: this.state.loadPosition,
                        });
                    });
                }
            }
        }
    }

    updateTalentList(newValues) {
        this.setState({
            talentList: newValues,
        });
    }

    getTalentList(callback) {
        console.log('talentList', this.state.loadPosition);
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/getTalent',
            headers: {
                Authorization: 'Bearer ' + cookies,
                'Content-Type': 'application/json',
            },
            type: 'GET',
            data: {
                position: this.state.loadPosition,
                number: this.state.loadNumber,
            },
            contentType: 'application/json',
            dataType: 'json',
            success: function (res) {
                let talentList = null;
                if (res.success) {
                    if (res.data && res.data.length > 0) {
                        // Directly use the array of talent data
                        console.log('talentList', res.data);

                        if (res.data.length < 5) {
                            this.setState({ isGreaterThanLoadNumber: false });
                        }

                        talentList = res.data;
                    } else {
                        console.log('No talent data received');
                        this.setState({ isGreaterThanLoadNumber: false });
                    }
                } else {
                    alert('Unable to fetch talentsnapshot');
                    console.log(res);
                }
                this.updateTalentList(talentList);
                this.setState({ isGreaterThanLoadNumber: talentList && talentList.length >= this.state.loadNumber });
                callback();
            }.bind(this),
            error: function (res) {
                console.log(res.status);
                this.setState({ isGreaterThanLoadNumber: false });
                callback();
            },
        });
    }

    render() {
        const { employerData, feedData, talentList, loadingTalentList } = this.state;

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <React.Fragment>
                        <div className="ui container">
                            <div className="ui grid">
                                <div className="row">
                                    <div className="five wide column">
                                        <CompanyProfile employerData={employerData.companyContact} />
                                    </div>
                                    <div className="six wide column">
                                        {loadingTalentList ? (
                                            <Loader active>Loading talents...</Loader>
                                        ) : (talentList && talentList.length) ? (
                                            talentList.map((talent) => (
                                                <TalentCard key={talent.id} talent={talent} />
                                            ))
                                        ) : (
                                            <h3>There are no talents found for your recruitment company</h3>
                                        )}
                                    </div>
                                    <div className="five wide column">
                                        <div className="ui card">
                                            <FollowingSuggestion profiles={feedData} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                </div>
            </BodyWrapper>
        );
    }
}
