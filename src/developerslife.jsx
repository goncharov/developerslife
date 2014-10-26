	/** @jsx React.DOM */

	var Post = React.createClass({
		render: function() {
			return (
				<div className="post">
					<div className="post-main-info">
						<div className="post-votes">{this.props.post.votes}</div>
						<div className="post-description">{this.props.post.description}</div>
					</div>
					<img className="post-image pure-img" src={this.props.post.gifURL} />
					<div className="post-secondary-info">
						<span className="post-date">{this.props.post.date}</span>
						<span> by </span>
						<span className="post-author">{this.props.post.author}</span>
					</div>
				</div>
			);
		}
	});

	var PostsList = React.createClass({
		render: function() {
			var nodes = this.props.posts.map(function(post) {
				return (
					<Post key={post.id} post={post} />
				)
			});
			return (
				<div className="posts">
					{nodes}
				</div>
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

	var Life = React.createClass({
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
				<div className="life">
					<PostsList posts={this.state.posts} />
				</div>
			);
		}
	});

	React.renderComponent(<Life />, document.getElementById('content'));
