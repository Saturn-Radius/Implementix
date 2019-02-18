import React from 'react'
import moment from 'moment-timezone'
import { DateRange } from 'react-date-range'
import { Button } from 'semantic-ui-react'
import Modal from 'react-modal'

const modalStyle = {
	overlay : {
		position: null,
		top: null,
		left: null,
		right: null,
		bottom: null,
		backgroundColor: null
	},
	content : {
		position: null,
		top: null,
		left: null,
		right: null,
		bottom: null,
		border: 'none',
		background: 'none',
		overflow: 'auto',
		WebkitOverflowScrolling: 'touch',
		borderRadius: '0',
		outline: 'none',
		padding: '0'
	}
}

export const FORMAT = 'YYYY-MM-DD'
const PREDEFINED = {
  'Today': {
    startDate: function startDate(now) {
      return now
    },
    endDate: function endDate(now) {
      return now
    }
  },

  'Past 7 Days': {
    startDate: function startDate(now) {
      return now.add(-6, 'days')
    },
    endDate: function endDate(now) {
      return now
    }
  },
  
  // 'Past 14 Days': {
  //   startDate: function startDate(now) {
  //     return now.add(-13, 'days')
  //   },
  //   endDate: function endDate(now) {
  //     return now
  //   }
  // },

  // 'Past 30 Days': {
  //   startDate: function startDate(now) {
  //     return now.add(-29, 'days')
  //   },
  //   endDate: function endDate(now) {
  //     return now
  //   }
  // },

  'Last Week': {
    startDate: function startDate(now) {
      return moment().startOf('isoWeek').add(-7, 'days')
    },
    endDate: function endDate(now) {
      return moment().startOf('isoWeek').add(-1, 'days')
    }
  },

  'Last Month': {
    startDate: function startDate(now) {
      return moment().startOf('month').add(-1, 'months')
    },
    endDate: function endDate(now) {
      return moment().startOf('month').add(-1, 'days')
    }
  },

  'Last Quarter': {
    startDate: function startDate(now) {
      let quarterAdjustment= (moment().month() % 3) + 1
      let lastQuarterEndDate = moment().subtract({ months: quarterAdjustment }).endOf('month')
      let lastQuarterStartDate = lastQuarterEndDate.clone().subtract({ months: 2 }).startOf('month')
      return lastQuarterStartDate
    },
    endDate: function endDate(now) {
      let quarterAdjustment= (moment().month() % 3) + 1
      let lastQuarterEndDate = moment().subtract({ months: quarterAdjustment }).endOf('month')
      return lastQuarterEndDate
    }
  },

  'Last 6 Months': {
    startDate: function startDate(now) {
      return moment().startOf('month').add(-6, 'months')
    },
    endDate: function endDate(now) {
      return moment().startOf('month').add(-1, 'days')
    }
  },

  'Last Year': {
    startDate: function startDate(now) {
      return moment().startOf('year').add(-1, 'years')
    },
    endDate: function endDate(now) {
      return moment().startOf('year').add(-1, 'days')
    }
  }
}
const THEME = {
  DateRange      : {
    background	 : 'transparent',
    display 		 : 'inline-table',
  },
  Calendar       : {
    width				 : 200,
    background   : 'transparent',
    color        : '#fff',
  },
  MonthAndYear   : {
    background   : '#717375',
    color        : '#fff'
  },
  MonthButton    : {
    background   : '#555A5F'
  },
  MonthArrowPrev : {
    borderRightColor : '#fff',
  },
  MonthArrowNext : {
    borderLeftColor : '#fff',
  },
  Weekday        : {
    color        : '#c6cbd0'
  },
  Day            : {
    transition   : 'transform .1s ease, box-shadow .1s ease, background .1s ease'
  },
  DaySelected    : {
    background   : '#45d9b8'
  },
  DayActive    : {
    background   : '#45d9b8',
    boxShadow    : 'none'
  },
  DayInRange     : {
    background   : '#25b998',
    color        : '#fff'
  },
  DayHover       : {
    background   : '#ffffff',
    color        : '#7f8c8d',
    transform    : 'scale(1.1) translateY(-10%)',
    boxShadow    : '0 2px 4px rgba(0, 0, 0, 0.4)'
  },
  PredefinedRanges : {
    color				 : '#fff',
    background 	 : 'transparent',
    marginLeft	 : 10, 
    marginTop		 : 10 
  }, 
  PredefinedRangesItem : {
    background	 : 'transparent',
    color				 : '#fff',
    padding			 : '2px',
  },
  PredefinedRangesItemActive : {
    color				 : ''
  }
}

export default class DateRangePicker extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      display: false,
      isSet: false,
      isWorking: false,
      startDate: moment(),
      endDate: moment(),
      workingStartDate: moment(),
      workingEndDate: moment()
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.startDate == null || nextProps.endDate == null){
      this.setState({
        display: false,
        isSet: false,
        isWorking: false,
        startDate: moment(),
        endDate: moment(),
        workingStartDate: moment(),
        workingEndDate: moment()
      })
    }
  }
  
  handleChange(payload) {
    this.setState({
      isWorking: true,
      workingStartDate : payload.startDate,
      workingEndDate : payload.endDate
    })
  }

  onClickTitle() {
    this.setState({
      display: !this.state.display
    })
  }

  onClickApply() {
    if(!this.state.isWorking){
      this.setState({
        isSet: false,
        isWorking: false,
        display: false,
        startDate: moment(),
        endDate: moment(),
        workingStartDate: moment(),
        workingEndDate: moment()
      })
      if(this.props.onCancel)
        this.props.onCancel()
    }else{
      this.setState({
        isSet: true,
        isWorking: false,
        display: false,
        startDate: this.state.workingStartDate,
        endDate: this.state.workingEndDate
      })
      if(this.props.onApply)
        this.props.onApply(this.state.workingStartDate, this.state.workingEndDate)
    }
  }

  onClickCancel() {
    if(this.state.isWorking){
      this.setState({
        display: false,
        isWorking: false,
        workingStartDate: this.state.startDate,
        workingEndDate: this.state.endDate
      })
    }else{
      this.setState({
        display: false,
        isWorking: false,
      })
    }    
  }

  onClickClear() {
    this.setState({
      isSet: false,
      isWorking: false,
      display: false,
      workingStartDate: moment(),
      workingEndDate: moment()
    })
    if(this.props.onClear)
      this.props.onClear()
  }

  render() {
    const {display, isSet, isWorking, startDate, endDate, workingStartDate, workingEndDate} = this.state
    let range = ''
    if((isSet || isWorking) && workingStartDate && workingEndDate)
      range = (workingStartDate && workingStartDate.format(FORMAT).toString()) + ' ~ ' + (workingEndDate && workingEndDate.format(FORMAT).toString())
    else
      range = 'Not set'
    return (
      <div className="date-range">
        <div className="date-range-header">
          <Button onClick={::this.onClickTitle}>{range}</Button>
        </div>
        <Modal
          className="modal-dialog modal-trans modal-daterange"
          style={modalStyle}
          isOpen={display}
          contentLabel="Modal"
          onRequestClose={::this.onClickCancel}
          closeTimeoutMS={150}
          >
          <div className="modal-dialog">
            <div className="modal-content">
              <div>
                <div className="modal-header">
                  <div className="date-range-value">
                    Range:<span>{range}</span>
                  </div>
                </div>
                <div className="modal-body">
                  <DateRange
                    startDate={ workingStartDate }
                    endDate={ workingEndDate }
                    linkedCalendars={ true }
                    ranges={ PREDEFINED }
                    onChange={ this.handleChange.bind(this) }
                    theme={THEME}
                  />
                </div>
                <div className="modal-footer">
                  <Button primary disabled={!isWorking} onClick={::this.onClickApply}>Apply</Button>
							    <Button secondary onClick={::this.onClickCancel}>Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
