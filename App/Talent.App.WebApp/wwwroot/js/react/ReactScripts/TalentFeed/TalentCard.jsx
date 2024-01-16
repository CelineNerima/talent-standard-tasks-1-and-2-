import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import { Card, Icon, Grid, Item } from 'semantic-ui-react';

export default class TalentCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showVideo: false,
        };

        this.talentVideoUrl = 'https://youtube.com/watch?v=w7ejDZ8SWv8&t=12s';

        this.toggleVideoDisplay = this.toggleVideoDisplay.bind(this);
        this.openLinkedIn = this.openLinkedIn.bind(this);
        this.openGithub = this.openGithub.bind(this);
    }

    toggleVideoDisplay() {
        this.setState((prevState) => ({
            showVideo: !prevState.showVideo,
        }));
    }

    openLinkedIn() {
        const { talent } = this.props;
        window.open((talent && talent.linkedIn) || 'https://www.linkedin.com/');
    }

    openGithub() {
        const { talent } = this.props;
        window.open((talent && talent.github) || 'https://www.github.com/');
    }

    renderOtherIcons() {
        return (
            <span>
                <Icon name="file pdf outline" style={{ marginLeft: '24px', marginRight: '32px' }} />
                <Icon name="linkedin" style={{ marginLeft: '24px', marginRight: '32px' }} onClick={this.openLinkedIn} />
                <Icon name="github" style={{ marginLeft: '24px' }} onClick={this.openGithub} />
            </span>
        );
    }

    render() {
        const { talent } = this.props;
        const { showVideo } = this.state;

        if (!talent) {
            return null;
        }

        return (
            <Card fluid>
                <Card.Content>
                    <Icon className='right floated' name='star' size='large'></Icon>
                    <Card.Header>{talent.name}</Card.Header>
                </Card.Content>
                {this.state.showVideo ? (
                    <Card.Content>
                        <ReactPlayer
                            width='100%' height='100%'
                            url={this.talentVideoUrl}
                        />
                    </Card.Content>
                ) : (
                    <Card.Content>
                        <Item.Group>
                            <Item>
                                <Item.Image size='small' src={talent.photoId} />
                                <Item.Content>
                                    <Item.Header as='a'>Talent snapshot</Item.Header>
                                    <br /><br />
                                    <Item.Header as='a'>Current Employer</Item.Header>
                                    <br /><span>{talent.currentEmployment}</span><br /><br />
                                    <Item.Header as='a'>Visa Status</Item.Header>
                                    <br /><span>{talent.visa ? talent.visa : "Unknown"}</span><br /><br />
                                    <Item.Header as='a'>Position</Item.Header>
                                    <br /><span>{talent.level}</span><br /><br />
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Card.Content>
                )}
                <Card.Content extra>
                    <Grid columns={4}>
                        <Grid.Row>
                            <Grid.Column>
                                {showVideo ?
                                    (<Icon name='user' size='large' onClick={() => this.setState({ "showVideo": false })} />)
                                    :
                                    (<Icon name='video' size='large' onClick={() => this.setState({ "showVideo": true })} />)
                                }
                            </Grid.Column>
                            <Grid.Column>
                                <Icon size='large' name='file pdf outline' />
                            </Grid.Column>
                            <Grid.Column>
                                <Icon name='linkedin' size='large' onClick={this.openLinkedIn}></Icon>
                            </Grid.Column>
                            <Grid.Column>
                                <Icon size='large' name='github' onClick={this.openGithub} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card.Content>
            </Card>
        );

    }
}

TalentCard.propTypes = {
    talent: PropTypes.shape({
        currentEmployment: PropTypes.string,
        level: PropTypes.string,
        name: PropTypes.string,
        photoId: PropTypes.string,
        skills: PropTypes.arrayOf(PropTypes.string),
        summary: PropTypes.string,
        visa: PropTypes.string,
        linkedIn: PropTypes.string,
        github: PropTypes.string,
    }),
};
