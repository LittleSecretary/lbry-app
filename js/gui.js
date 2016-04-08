//component/icon.js

var Icon = React.createClass({
  render: function() {
    var className = 'icon ' + this.props.icon;
    return <span className={className}></span>
  }
});

//component/link.js

var Link = React.createClass({
  render: function() {
    console.log(this.props);
    var href = this.props.href ? this.props.href : 'javascript:;',
        icon = this.props.icon ? <Icon icon={this.props.icon} />  : '',
        className = (this.props.button ? 'button-block button-' + this.props.button : 'button-text') +
                    (this.props.fadeIn ? ' fade-in-link' : '');
    return (
      <a className={className} href={href} style={this.props.style ? this.props.style : {}} onClick={this.props.onClick}>
        {this.props.icon ? icon : '' }
        {this.props.label}
      </a>
    );
  }
});


//component/splash.js
var splashStyle = {
  color: 'white',
  backgroundImage: 'url(' + lbry.imagePath('lbry-bg.png') + ')',
  backgroundSize: 'cover',
  minHeight: '100vh',
  minWidth: '100vw',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}, splashMessageStyle = {
  marginTop: '24px'
};

var SplashScreen = React.createClass({
  propTypes: {
    message: React.PropTypes.string,
  },
  render: function() {
    var imgSrc = lbry.imagePath('lbry-white-485x160.png');
    return (
       <div className="splash-screen" style={splashStyle}>
         <img src={imgSrc} alt="LBRY"/>
         <div style={splashMessageStyle}>
           <h3>
             {this.props.message}
             <span className="busy-indicator"></span>
            </h3>
         </div>
       </div>
    );
  }
});

//component/credit-amount.js
var creditAmountStyle = {
  color: '#216C2A',
  fontWeight: 'bold',
  fontSize: '0.8em'
}, estimateStyle = {
  marginLeft : '5px',
  color: '#aaa',
};

var CreditAmount = React.createClass({
  propTypes: {
    amount: React.PropTypes.number,
  },
  render: function() {
    var formattedAmount = lbry.formatCredits(this.props.amount);
    return (
      <span className="credit-amount">
        <span style={creditAmountStyle}>{formattedAmount}</span>
        { this.props.isEstimate ? <span style={estimateStyle}>(est)</span> : null }
      </span>
    );
  }
});

//component/header.js
var logoStyle = {
  padding: '48px 12px',
  textAlign: 'center',
  maxHeight: '80px',
},
    balanceStyle = {
//  float: 'right',
  marginTop: '3px'
},
    imgStyle = { //@TODO: remove this, img should be properly scaled once size is settled
  height: '80px'
};

var Header = React.createClass({
  render: function() {
    return (
      <header>
        <div style={logoStyle}>
          <img src="./img/lbry-dark-1600x528.png" style={imgStyle}/>
        </div>
      </header>
    );
  }
});

var topBarStyle = {
  'float': 'right'
};

var TopBar = React.createClass({
  getInitialState: function() {
    return {
      balance: 0
    };
  },
  componentDidMount: function() {
    lbry.getBalance(function(balance) {
      this.setState({
        balance: balance
      });
    }.bind(this));
  },

  render: function() {
    return (
      <span className='top-bar' style={topBarStyle}>
        <span style={balanceStyle}>
          <CreditAmount amount={this.state.balance}/>
        </span>
        <Menu onPageChosen={this.props.onPageChosen}/>
      </span>
    );
  }
});

var menuStyle = {
  position: 'relative',
  top: '3px',
  marginLeft: '2px'
}, menuItemStyle = {
  marginLeft: '3px'
};

var chooseSettingsPage = function() {
  this.props.onPageChosen('settings');
};

var Menu = React.createClass({
  render: function() {
    return (
      <span className='menu' style={menuStyle}>
        <Link href='#' icon="icon-gear" fadeIn={true} style={menuItemStyle} onClick={chooseSettingsPage.bind(this)}/>
      </span>
    )
  }
});


//component/discover.js

var searchInputStyle = {
  width: '400px',
  display: 'block',
  marginBottom: '48px',
  marginLeft: 'auto',
  marginRight: 'auto'
},
    fetchResultsStyle = {
  color: '#888',
  textAlign: 'center',
  fontSize: '1.2em'
};

var SearchActive = React.createClass({
  render: function() {
    return (
      <section style={fetchResultsStyle}>
        Looking up the Dewey Decimals
        <span className="busy-indicator"></span>
      </section>
    );
  }
});

var searchNoResultsStyle = {
  textAlign: 'center'
}, searchNoResultsMessageStyle = {
  fontStyle: 'italic',
  marginRight: '5px'
};

var SearchNoResults = React.createClass({
  render: function() {
    return (
        <section style={searchNoResultsStyle}>
          <span style={searchNoResultsMessageStyle}>No one has checked anything in for {this.props.query} yet.</span>
          <Link label="Be the first" href="javascript:alert('aww I do nothing')" />
        </section>
    );
  }
});

var SearchResults = React.createClass({
  render: function() {
    var rows = [];
    console.log('results');
    console.log('made it here');
    this.props.results.forEach(function(result) {
      rows.push(
        <SearchResultRow name={result.name} title={result.stream_name} imgUrl={result.thumbnail}
                          description={result.description} cost_est={result.cost_est} />
      );
    });
    console.log(this.props.results);
    console.log(rows);
    console.log('done');
    return (
      <section>{rows}</section>
    );
  }
});

var searchRowImgStyle = {
  maxHeight: '100px',
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  float: 'left'
}, 
    searchRowCostStyle = {
  float: 'right',
  marginLeft: '20px',
  marginTop: '5px',
  display: 'inline-block'
},
    searchRowNameStyle = {
  fontSize: '0.9em',
  color: '#666',
  marginBottom: '24px',
  clear: 'both'
},
    searchRowDescriptionStyle = {
  color : '#444',
  marginBottom: '24px',
  fontSize: '0.9em'
};


var SearchResultRow = React.createClass({
  render: function() {
    var uri = 'lbry://' + this.props.name;
    return (
      <div className="row-fluid">
        <div className="span3">
          <img src={this.props.imgUrl} alt="Photo for {this.props.title}" style={searchRowImgStyle} />
        </div>
        <div className="span9">
          <span style={searchRowCostStyle}>
            <CreditAmount amount={this.props.cost_est} isEstimate={true}/>
          </span>
          <h2>{this.props.title}</h2>
          <div style={searchRowNameStyle}>{uri}</div>
          <p style={searchRowDescriptionStyle}>{this.props.description}</p>
          <div>
            <Link href={uri} label="Watch" icon="icon-play" button="primary" />
            <Link href={uri} label="Download" icon="icon-download" button="alt" />
          </div>
        </div>
      </div>
    );
  }
});


var discoverMainStyle = {
  color: '#333'
};

var Discover = React.createClass({
  userTypingTimer: null,

  getInitialState: function() {
    return {
      results: [],
      searching: false,
      query: ''
    };
  },

  search: function() {
    if (this.state.query)
    {
      console.log('search');
      lbry.search(this.state.query, this.searchCallback.bind(this, this.state.query));
    }
    else
    {
      this.setState({
        searching: false,
        results: []
      });
    }
  },

  searchCallback: function(originalQuery, results) {
    if (this.state.searching) //could have canceled while results were pending, in which case nothing to do
    {
      this.setState({
        results: results,
        searching: this.state.query != originalQuery, //multiple searches can be out, we're only done if we receive one we actually care about
      });
    }
  },

  onQueryChange: function(event) {
    if (this.userTypingTimer)
    {
      clearTimeout(this.userTypingTimer);
    }

    //@TODO: Switch to React.js timing
    this.userTypingTimer = setTimeout(this.search, 800); // 800ms delay, tweak for faster/slower

    this.setState({
      searching: event.target.value.length > 0,
      query: event.target.value
    });
  },

  render: function() {
    console.log(this.state);
    return (
      <main style={discoverMainStyle}>
        <section><input type="search" style={searchInputStyle} onChange={this.onQueryChange}
          placeholder="Find movies, music, games, and more"/></section>
        { this.state.searching ? <SearchActive /> : null }
        { !this.state.searching && this.state.results.length ? <SearchResults results={this.state.results} /> : null }
        { !this.state.searching && !this.state.results.length && this.state.query ? <SearchNoResults query={this.state.query} /> : null }
      </main>
    );
  }
});

var HomePage = React.createClass({
  render: function() {
    return (
      <div>
        <Header />
        <Discover />
      </div>
    );
  }
});

var settingsPageStyles = {
  paddingTop: '60px',
  fontSize: '16px',
}, settingsPageHeaderStyles = {
  textAlign: 'center'
}, settingsBottomButtonsStyles = {
  textAlign: 'center'
}, settingsSectionStyles = {
  paddingBottom: '15px',
}, settingsQuestionStyles = {
  display: 'block',
}, maxDownloadQuestionStyles = {
  display: 'block',
  paddingTop: '3px'
}, maxUploadQuestionStyles = {
  display: 'block'
}, settingsRadioOptionStyles = {
  display: 'block',
  marginLeft: '13px'
}, settingsCheckBoxOptionStyles = {
  display: 'block',
  marginLeft: '13px'
}, settingsNumberFieldStyles = {
  width: '40px'
}, downloadDirectoryLabelStyles = {
  fontSize: '.9em',
  marginLeft: '13px'
}, downloadDirectoryFieldStyles= {
  width: '300px'
};

var SettingsPage = React.createClass({
  storeSetting: function(setting, val) {
    var settings = Object.assign({}, this.state.settings);
    settings[setting] = val;
    this.setState({
      'settings': settings
    });
  },
  onRunOnStartChange: function (event) {
    this.storeSetting('run_on_startup', event.target.checked);
  },
  onDownloadDirChange: function(event) {
    this.storeSetting('default_download_directory', event.target.value);
  },
  onMaxUploadPrefChange: function(isLimited) {
    if (!isLimited) {
      this.storeSetting('max_upload', 0.0);
    }
    this.setState({
      isMaxUpload: isLimited
    });
  },
  onMaxUploadFieldChange: function(event) {
    this.storeSetting('max_upload', Number(event.target.value));
  },
  onMaxDownloadPrefChange: function(isLimited) {
    if (!isLimited) {
      this.storeSetting('max_download', 0.0);
    }
    this.setState({
      isMaxDownload: isLimited
    });
  },
  onMaxDownloadFieldChange: function(event) {
    this.storeSetting('max_download', Number(event.target.value));
  },
  getInitialState: function() {
    return {
      isMaxUpload: false,
      isMaxDownload: false,
      settings: null
    }
  },
  componentWillMount: function() {
    lbry.getSettings(function(settings) {
      this.setState({
        settings: settings
      });
    }.bind(this));
  },
  onDone: function() {
    lbry.setSettings(this.state.settings);
    this.props.closeCallback();
  },
  render: function() {
    if (!this.state.settings) { // If the settings aren't loaded yet, don't render anything.
      return null;
    }

    return (
      <div style={settingsPageStyles}>
        <h1 style={settingsPageHeaderStyles}>Settings</h1>
        <section style={settingsSectionStyles}>
        <h4>Run on startup</h4>
        <label style={settingsCheckBoxOptionStyles}>
          <input type="checkbox" onChange={this.onRunOnStartChange} defaultChecked={false} /> Run LBRY automatically when I start my computer
        </label>
        </section>

        <section style={settingsSectionStyles}>
          <h4>Download directory</h4>
          <span style={settingsQuestionStyles}>Where would you like the files you download from LBRY to be saved?</span>
          <label htmlFor="default_download_directory" style={downloadDirectoryLabelStyles}>Download directory: </label><input style={downloadDirectoryFieldStyles} type="text" name="default_download_directory" defaultValue={this.state.settings['default_download_directory']} onChange={this.onDownloadDirChange}/>
        </section>

        <section style={settingsSectionStyles}>
          <h4>Bandwidth limits</h4>
          <span style={maxUploadQuestionStyles}>How much of your upload bandwidth may LBRY use?</span>
          <label style={settingsRadioOptionStyles}>
            <input type="radio" name="max_upload_pref" onChange={this.onMaxUploadPrefChange.bind(this, false)}/> Unlimited
          </label>
          <label style={settingsRadioOptionStyles}>
            <input type="radio" name="max_upload_pref" onChange={this.onMaxUploadPrefChange.bind(this, true)}/> { this.state.isMaxUpload ? 'Up to' : 'Choose limit...' }
            <span className={ this.state.isMaxUpload ? '' : 'hidden'}> <input type="number" min="0" step=".5" defaultValue={this.state.settings['max_upload']} style={settingsNumberFieldStyles} onChange={this.onMaxUploadFieldChange}/> MB/s</span>
          </label>
          <span style={maxDownloadQuestionStyles}>How much of your download bandwidth may LBRY use?</span>
          <label style={settingsRadioOptionStyles}>
            <input type="radio" name="max_download_pref" onChange={this.onMaxDownloadPrefChange.bind(this, false)}/> Unlimited
          </label>
          <label style={settingsRadioOptionStyles}>
            <input type="radio" name="max_download_pref" onChange={this.onMaxDownloadPrefChange.bind(this, true)}/> { this.state.isMaxDownload ? 'Up to' : 'Choose limit...' }
            <span className={ this.state.isMaxDownload ? '' : 'hidden'}> <input type="number" min="0" step=".5" defaultValue={this.state.settings['max_download']} style={settingsNumberFieldStyles} onChange={this.onMaxDownloadFieldChange}/> MB/s</span>
          </label>
        </section>
        <div style={settingsBottomButtonsStyles}>
          <Link href="#" onClick={this.onDone} label="Done" button="primary" icon="icon-check"/>
        </div>
      </div>
    );
  }
});


var appStyles = {
    width: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
};
var App = React.createClass({
  getInitialState: function() {
    return {
      viewingPage: 'home'
    }
  },
  handlePageChosen: function(page) {
    this.setState({
      viewingPage: page
    });
  },
  render: function() {
    if (this.state.viewingPage == 'home') {
      var content = <HomePage/>;
    } else if (this.state.viewingPage == 'settings') {
      var content = <SettingsPage closeCallback={this.handlePageChosen.bind(this, 'home')}/>;
    }
    return (
      <div style={appStyles}>
      <TopBar onPageChosen={this.handlePageChosen}/>
      {content}
      </div>
    );
  }
});

//main.js
var init = function() {
  var canvas = document.getElementById('canvas');

  ReactDOM.render(
    <SplashScreen message="Connecting"/>,
    canvas
  );

  lbry.connect(function() {
    ReactDOM.render(<App/>, canvas);
  })
};

init();

