import React from 'react';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Moment from 'react-moment';
import CircularProgress from 'material-ui/CircularProgress';
import HtmlTextField from '../Components/HtmlTextField';
import * as coreAuth from '../core/auth';
import * as apiRequest from '../api/request';
import { translate } from '../core/i18n';
import { goTo, tryGoBack } from '../core/navigation';
import DOMPurify from 'dompurify'
import {
  Step,
  Stepper,
  StepLabel,
  StepContent,
} from 'material-ui/Stepper';
import '../Chat.css';

const _ = require('underscore');

const defaultProfileImageUrl = '/images/avatar.png';

export default class ChatRoom extends React.Component {
    constructor() {
        super();

        this.state = {
            isLoading: true,
            newMessage: '',
            task: {},
            users: {},
            messages: []
        };

        this.handleNewMessage = this.handleNewMessage.bind(this);
    }

    componentDidMount() {
        !coreAuth.getUserId() && goTo('/login');

        let requestId = this.props.params.chatId;

        apiRequest.getItem(requestId)
        .then(chat => this.setState({
            isUserOwner: coreAuth.getUserId() == chat.task.userId,
            requestId,
            isLoading: false,
            fromUserId: coreAuth.getUserId(),
            toUserId: chat.messages[0].fromUserId === coreAuth.getUserId() ? chat.messages[0].toUserId : chat.messages[0].fromUserId,
            messages: chat.messages,
            users: chat.users,
            task: chat.task,
            request: chat.request
        }));
    }
    handleNewMessage (event) {
        event.preventDefault()
    
        const data = {
            taskId: this.state.task.id,
            toUserId: this.state.toUserId,
            fromUserId: this.state.fromUserId,
            requestId: this.state.requestId,
            message: this.state.newMessage
        };

        this.state.messages.push(data);
        
        this.setState({
            newMessage: '',
            messages: this.state.messages
        });

        apiRequest.createItemMessage(this.state.requestId, data);
    }
    render() {
        return (
                <div className="container st-chat-view">
                    { this.state.isLoading && 
                        <div className="text-center" style={{ 'marginTop': '40px' }}>
                            <CircularProgress size={80} thickness={5} />
                        </div>
                    }
                    { !this.state.isLoading && 
                        <div className="col-xs-12">
                            <div className="col-xs-12 col-sm-8">
                                    { this.state.task &&
                                        <div className="row">
                                            <div className="col-xs-12" style={{ margin: '10px' }}>
                                                <RaisedButton 
                                                    onClick={() => tryGoBack(`/chat`)}
                                                    label={translate('BACK')}
                                                />
                                            </div>    
                                            <div className="col-xs-12" style={ { margin: '10px' } }>
                                                <h1 className="st-h1">
                                                    <a style={{
                                                        textDecoration: 'none',
                                                        cursor: 'pointer'
                                                    }} onTouchTap={() => goTo(`/task/${this.state.task.id}`)}>
                                                        { this.state.task.title }
                                                    </a>
                                                </h1>
                                                <div className="col-xs-12">
                                                    <Divider />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    { this.state.messages
                                        .map(message => {
                                            const sender = this.state.users[message.fromUserId];

                                            const firstName = sender.firstName;
                                            const lastName = sender.lastName;
                                            const profileImageUrl = sender.imageUrl || defaultProfileImageUrl;

                                            return <div className="row" style={ { paddingLeft: '20px', marginTop: '20px'} }>
                                                        <div className="col-xs-12" style={ { marginBottom: '20px'} }>
                                                            <div className="row">
                                                                <div className="col-xs-2 col-sm-1">
                                                                    <a 
                                                                        style={{
                                                                            cursor: 'pointer'
                                                                        }} 
                                                                        onClick={
                                                                            () => goTo(`/profile/${message.fromUserId}`)
                                                                        }>
                                                                        <img
                                                                            alt="profile"
                                                                            style={{ 
                                                                                borderRadius: '50%', 
                                                                                width: '50px',
                                                                                height: '50px' 
                                                                            }} 
                                                                            src={profileImageUrl}
                                                                        />
                                                                    </a>
                                                                </div>
                                                                <div className="col-xs-10 col-sm-11" style={{ marginTop: 6 }}>
                                                                    <strong>
                                                                        <a
                                                                            style={{
                                                                                textDecoration: 'none',
                                                                                cursor: 'pointer'
                                                                            }}
                                                                            onClick={() => goTo(`/profile/${message.fromUserId}`)}>
                                                                        {firstName} {lastName}
                                                                        </a>
                                                                        </strong>
                                                                    <br />
                                                                    <p className="text-muted">
                                                                        <Moment format="DD.MM.YYYY, HH:mm">{message.createdAt}</Moment>
                                                                    </p>
                                                                </div>
                                                            </div>   
                                                        </div>
                                                        <div className="col-xs-12">
                                                            <div dangerouslySetInnerHTML={{
                                                                __html: DOMPurify.sanitize(message.message)
                                                            }} />
                                                            <Divider style={ { marginRight: '10px' } }/>
                                                        </div>
                                                </div>;
                                        })
                                    }

                                    <Paper zDepth={1} style={ { paddingBottom: '10px' } }>
                                        <div className="row" style={{
                                            paddingLeft: '20px',
                                            marginTop: '20px',
                                            paddingRight: '20px'
                                        }}>
                                        <div className="col-xs-12">
                                            <form onSubmit={this.handleNewMessage}>
                                                    <h4>{translate("REPLY")}</h4>
                                                    <HtmlTextField                                                    
                                                        onChange={(event, newMessage) => this.setState({
                                                            newMessage
                                                        })}
                                                        value={this.state.newMessage}
                                                    />
                                                    
                                                    <RaisedButton type="submit" style={{ width: '100%' }} label={translate("SEND")} />
                                            </form>
                                        </div>
                                    </div>
                                 </Paper>
                            </div>

                            <div className="col-xs-12 col-sm-4">
                                    <Paper zDepth={1} style={ { padding: '10px' } }>
                                        <div className="row">
                                            <div className="col-xs-12" style={ { marginBottom: '20px'} }>
                                                <h4>{translate("IN_THIS_CHAT")}</h4>
                                            </div>    
                                        </div>   
                                        <div className="row">
                                            <div className="col-xs-12" style={ { marginBottom: '10px'} }>
                                                { Object.keys(this.state.users)
                                                .map(userId => {
                                                    const user = this.state.users[userId];
                                                    const firstName = user.firstName;
                                                    const lastName = user.lastName;
                                                    const profileImageUrl = user.imageUrl || defaultProfileImageUrl;
                                                    const name = `${firstName} ${lastName}`;
                                                    const profileBio = user.bio;

                                                    return <div className="row" style={{ marginBottom: '10px' }}>
                                                                <a href={`/app/profile/${userId}`}>
                                                                    <div className="col-xs-4 col-sm-3 col-md-2">
                                                                        <img alt={name}
                                                                            style={{ 
                                                                                borderRadius: '50%',
                                                                                width: '50px',
                                                                                height: '50px' 
                                                                            }} 
                                                                            src={profileImageUrl} 
                                                                        />
                                                                    </div>
                                                                    <div className="col-xs-8 col-sm-9 col-md-8">
                                                                            <strong>
                                                                                { name }
                                                                            </strong>
                                                                            <br />
                                                                            { profileBio }
                                                                    </div>
                                                                </a>
                                                            </div>;
                                                })} 
                                            </div>
                                        </div>
                                    </Paper>
                                    { this.state.isUserOwner &&
                                      this.state.request.status == 0 &&
                                        <RaisedButton
                                            backgroundColor={"#546e7a"}
                                            labelColor={"white"}
                                            style={{
                                                marginTop: 10,
                                                width: '100%'
                                            }}
                                            label={translate("BOOK")} 
                                            onClick={
                                                () => goTo(`/request/${this.state.requestId}/book`)
                                            }
                                        />
                                    }

                            <Stepper activeStep={
                                [ '0', '5', '10', '15' ].indexOf(this.state.request.status)
                            } orientation="vertical">
                            <Step>
                                <StepLabel>{translate('REQUEST_RECEIVED')}</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>{translate('REQUEST_BOOKED')}</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>{translate('REQUEST_MARKED_AS_DONE')}</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>{translate('REQUEST_SETLLED')}</StepLabel>
                            </Step>
                            </Stepper>
                            </div>
                        </div>   
                    }
            </div>    
        );
   }
};
