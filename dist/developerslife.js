	/** @jsx React.DOM */

	var Post = React.createClass({displayName: 'Post',
		render: function() {
			return (
				React.DOM.div({className: "post"}, 
					React.DOM.div({className: "post-main-info"}, 
						React.DOM.div({className: "post-votes"}, this.props.post.votes), 
						React.DOM.div({className: "post-description"}, this.props.post.description)
					), 
					React.DOM.img({className: "post-image pure-img", src: this.props.post.gifURL}), 
					React.DOM.div({className: "post-secondary-info"}, 
						React.DOM.span({className: "post-date"}, this.props.post.date), 
						React.DOM.span(null, " by "), 
						React.DOM.span({className: "post-author"}, this.props.post.author)
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
				success(response.query.results.json.result);
			},
			error: error
		});
	}

	var Life = React.createClass({displayName: 'Life',
		loadPosts: function(page) {
			getPostsForPage('latest', 0, 10, 
			function(posts) {
				this.setState({posts: posts});
			}.bind(this), function(xhr, status, error) {
				console.error(xhr, status, err.toString());
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
				React.DOM.div({className: "life"}, 
					PostsList({posts: this.state.posts})
				)
			);
		}
	});

	React.renderComponent(Life(null), document.getElementById('content'));
