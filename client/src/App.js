import React, { Component } from 'react';
import TwitterLogin from "react-twitter-auth";
import './App.css';
import { Input, FormBtn } from './Components/Form';
import API from "./utils/api";

class App extends Component {

	state = {
		isAuthenticated: false,
		user: null,
		token: '',
		username: "",
		password: ""
	};

	componentDidMount() {

		API.getSession()
			.then(res => {
				if (res.data) {
					this.setState({
						user: res.data,
						isAuthenticated: true
					})
				}
			})
			.catch(err => console.log(err));
	}

	handleInputChange = (event) => {
		let {name, value} = event.target;
		this.setState({[name]: value});
	}

	handleLoginSubmit = (event) => {
		event.preventDefault();

		API.login({
			username: this.state.username,
			password: this.state.password
		}).then(res => {
			console.log(res);
			this.setState({
				user: res.data,
				isAuthenticated: true
			})
		}).catch(err => console.log(err));
	}

	handleSignUpSubmit = (event) => {
		event.preventDefault();

		API.signUp({
			username: this.state.username,
			password: this.state.password
		}).then(res => {
			console.log(res);
			this.setState({
				user: res.data,
				isAuthenticated: true
			})
		}).catch(err => console.log(err));
	}

	login = (newUser) => {
		
		API.login(newUser)
			.then(user => this.setState({ 
				user: user,
				isAuthenticated: true
			}))
			.catch(err => console.log(err));
	}

	logout = () => {
		
		API.logout()
			.then(res => {
				console.log(res);
				this.setState({
					user: null,
					isAuthenticated: false
				})
			})
			.catch(err => console.log(err));
	}

	onSuccess = (response) => {

		const token = response.headers.get("x-auth-token");
		response.json().then(user => {
			if (token) {
				console.log(user);
				this.setState({
					isAuthenticated: true,
					user: user,
					token: token
				})
			}
		})
	};

	onFailed = (error) => {
		alert(error);
	};

	render() {
		
		return !!this.state.isAuthenticated ?
			(
				<div>
					<p>Authenticated</p>
					<div>
						Welcome {this.state.user.username}
					</div>
					<div>
						<TwitterLogin
							loginUrl="http://localhost:3001/api/auth/twitter"
							onFailure={this.onFailed} onSuccess={this.onSuccess}
							requestTokenUrl="http://localhost:3001/api/auth/twitter/reverse"
							credentials="include"
						/>
					</div>
					<div>
						<button onClick={this.logout} className="button">
							Log Out
						</button>
					</div>
				</div>
			) :
			(
				<div>
					<p>Login</p>
					<form>
						<Input
							value={this.state.username}
							onChange={this.handleInputChange}
							name="username"
							placeholder="Username"
						/>
						<Input 
							value={this.state.password}
							onChange={this.handleInputChange}
							name="password"
							type="password"
						/>
						<FormBtn
							onClick={this.handleLoginSubmit}
						>Login</FormBtn>
						<FormBtn
							onClick={this.handleSignUpSubmit}
						>Sign Up</FormBtn>
					</form>
				</div>
			)
	}
}

export default App;
