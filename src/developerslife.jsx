	/** @jsx React.DOM */

	var Post = React.createClass({
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
				<div className="post">
					<div className="post-main-info">
						<div className="post-votes">{this.state.votes}</div>
						<div className="post-description">{this.state.description}</div>
					</div>
					<div className={imgClasses}>
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

	var Life = React.createClass({
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
				<PostsList posts={this.state.posts} />
			);
		}
	});

	React.render(<Life />, document.body);
