	/** @jsx React.DOM */

	var Post = React.createClass({
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
				<div className="post">
					<div className="post-main-info">
						<div className="post-votes">{this.state.votes}</div>
						<div className="post-description">{this.state.description}</div>
					</div>
					<div className={"post-image " + this.state.isloaded}>
						<div className="post-image-overlay"><span>...</span></div>
						<img src={this.state.gif} />
					</div>
					<div className="post-secondary-info">
						<span className="post-date">{this.state.date}</span>
						<span> by </span>
						<span className="post-author">{this.state.author}</span>
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

	var Life = React.createClass({
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
				<PostsList posts={this.state.posts} />
			);
		}
	});

	React.renderComponent(<Life />, document.getElementById('content'));
