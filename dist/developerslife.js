	/** @jsx React.DOM */

	var Post = React.createClass({displayName: "Post",
		componentWillMount: function() {
			this.setState(this.props.post);
			this.setState({
				'gif': this.props.post.previewURL,
				'isloaded': false
			});
		},
		componentDidMount: function() {
			var gif = new Image();
			gif.onload = function() {
				this.setState({
					'gif': gif.src,
					'isloaded': true
				});
			}.bind(this);
			gif.width = 50;
			gif.src = this.state.gifURL;
		},
		render: function() {
			var imgClasses = classNames({
				'post-image': true,
				'isloaded': this.state.isloaded
			});
			return (
				React.createElement("div", {className: "post"}, 
					React.createElement("div", {className: "post-main-info"}, 
						React.createElement("div", {className: "post-votes"}, this.state.votes), 
						React.createElement("div", {className: "post-description"}, this.state.description)
					), 
					React.createElement("div", {className: imgClasses}, 
						React.createElement("div", {className: "post-image-overlay"}, React.createElement("span", null, "...")), 
						React.createElement("img", {src: this.state.gif})
					), 
					React.createElement("div", {className: "post-secondary-info"}, 
						React.createElement("span", {className: "post-date"}, this.state.date), 
						React.createElement("span", null, " by "), 
						React.createElement("span", {className: "post-author"}, this.state.author)
					)
				)
			);
		}
	});

	var PostsList = React.createClass({displayName: "PostsList",
		render: function() {
			var nodes = this.props.posts.map(function(post) {
				return (
					React.createElement(Post, {key: post.id, post: post})
				)
			});
			return (
				React.createElement("div", {className: "posts"}, 
					nodes
				)
			);
		}
	});

	var getPostsForPage = function(type, page, size, success, error) {
		var api = 'http://developerslife.ru/' + type + '/' + page + '?json=true&types=gif&pageSize=' + size;
		var proxyUrl = 'http://warm-plateau-6357.herokuapp.com/' + api;

		var xhr = new XMLHttpRequest();
		xhr.open('GET', proxyUrl, true);
		xhr.onload = function() {
			if (this.status >= 200 && this.status < 400) {
			var apiResults = JSON.parse(this.response);
				if (apiResults.result && apiResults.result) {
					success(apiResults.result);
				} else {
					error('yql:null');
				}
			} else {
					error(this.status);
			}
		};
		xhr.onerror = function() {
			error('onerror');
		};
		xhr.send();
	}

	var Life = React.createClass({displayName: "Life",
		getInitialState: function() {
			return {
				posts: [],
				page: 0
			};
		},
		loadPosts: function(page) {
			getPostsForPage('latest', 0, 10, 
				function(posts) {
					console.log(posts);
					this.setState({posts: posts});
				}.bind(this), function(error) {
					console.error(error);
				}.bind(this)
			);
		},
		componentDidMount: function() {
			this.loadPosts(0);
		},
		render: function() {
			return (
				React.createElement(PostsList, {posts: this.state.posts})
			);
		}
	});

	React.render(React.createElement(Life, null), document.body);
