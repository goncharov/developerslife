	/** @jsx React.DOM */

	var Post = React.createClass({displayName: 'Post',
		componentWillMount: function() {
			this.setState(this.props.post);
			this.setState({
				"gif": this.props.post.previewURL,
				"isloaded": ""
			});
		},
		componentDidMount: function() {
			var gif = new Image();
			gif.onload = function() {
				this.setState({
					"gif": gif.src,
					"isloaded": "isloaded"
				});
			}.bind(this);
			gif.width = 50;
			gif.src = this.state.gifURL;
		},
		render: function() {
			return (
				React.DOM.div({className: "post"}, 
					React.DOM.div({className: "post-main-info"}, 
						React.DOM.div({className: "post-votes"}, this.state.votes), 
						React.DOM.div({className: "post-description"}, this.state.description)
					), 
					React.DOM.div({className: "post-image " + this.state.isloaded}, 
						React.DOM.div({className: "post-image-overlay"}, React.DOM.span(null, "...")), 
						React.DOM.img({src: this.state.gif})
					), 
					React.DOM.div({className: "post-secondary-info"}, 
						React.DOM.span({className: "post-date"}, this.state.date), 
						React.DOM.span(null, " by "), 
						React.DOM.span({className: "post-author"}, this.state.author)
					)
				)
			);
		}
	});

	var PostsList = React.createClass({displayName: 'PostsList',
		render: function() {
			var nodes = this.props.posts.map(function(post) {
				return (
					Post({key: post.id, post: post})
				)
			});
			return (
				React.DOM.div({className: "posts"}, 
					nodes
				)
			);
		}
	});

	var getPostsForPage = function(type, page, size, success, error) {
		var api = 'http://developerslife.ru/' + type + '/' + page + '?json=true&types=gif&pageSize=' + size;
		var yql = "select * from json where url='" + encodeURIComponent(api) + "'";
		var yqlurl = 'https://query.yahooapis.com/v1/public/yql?q=' + yql + '&format=json';
		$.ajax({
			url: yqlurl,
			dataType: 'json',
			success: function(response) {
				if (response.query.results && response.query.results.json && response.query.results.json.result) {
					success(response.query.results.json.result);
				} else {
					error("yql:null");
				}
			},
			error: function(xhr, status, err) {
				error(err.toString);
			}
		});
	}

	var Life = React.createClass({displayName: 'Life',
		loadPosts: function(page) {
			getPostsForPage('latest', 0, 10, 
			function(posts) {
				console.log(posts);
				this.setState({posts: posts});
			}.bind(this), function(error) {
				console.error(error);
			}.bind(this));
		},
		componentDidMount: function() {
			this.loadPosts(0);
		},
		getInitialState: function() {
			return {posts: []};
		},
		render: function() {
			return (
				PostsList({posts: this.state.posts})
			);
		}
	});

	React.renderComponent(Life(null), document.getElementById('content'));
