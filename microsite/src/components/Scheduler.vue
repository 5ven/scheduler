<template>
  <u-animate-container>
    <div class="container">
      <div class="row">
        <div class="col-md-12 col-lg-12 col-sm-12">
          <Menu></Menu>
        </div>
      </div>
    </div>
  <section id="contact" class="section-padding" v-if="seller.email">
    <div class="container">
        <div class="row contact-form-area">
            <div class="col-md-6 col-lg-6 col-sm-12">
              <u-animate
                name="fadeInUp"
                delay="0.4s"
                :iteration="1"
                :offset="0"
                animateClass="animated"
              >
              <div class="contact-block">
                <h2>Schedule a Demo Session</h2>
                <div class="error" v-if="error">
                  <ul id="errors">
                    <li v-for="(errorMessage, index) in errorMessages" :key="index">
                      {{ errorMessage }}
                    </li>
                  </ul>
                </div>
                <form method="post" @submit.prevent="saveSchedule" v-if="!saved">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <input
                          type="text"
                          v-model="input.name.first"
                          class="form-control"
                          id="firstName"
                          name="firstName"
                          placeholder="First Name">
                        <div class="help-block with-errors"></div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <input
                          type="text"
                          v-model="input.name.last"
                          class="form-control"
                          id="lastName"
                          name="lastName"
                          placeholder="Last Name">
                        <div class="help-block with-errors"></div>
                      </div>
                    </div>
                    <div class="col-md-12">
                      <div class="form-group">
                        <input
                          type="text"
                          placeholder="Email"
                          id="email"
                          class="form-control"
                          v-model="input.email">
                        <div class="help-block with-errors"></div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <date-picker
                          :editable="false"
                          class="form-control"
                          v-model="input.startDate"
                          :lang="settings.calendarLanguage"
                          :first-day-of-week="firstDayOfWeek"
                          placeholder="Date"
                          :not-before="tomorrow"
                          type="date"
                          :format="dateFormat"
                          @change="dateChanged"
                          @clear="dateCleared">
                        </date-picker>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <date-picker
                          :editable="false"
                          input-name="input.startTime"
                          v-model="startTime"
                          :placeholder="'Time' + ' (' + timezone.split('/')[1].
                          replace(/_/g, ' ') + ')'"
                          :lang="settings.calendarLanguage"
                          type="time"
                          :format="timeFormat"
                          class="form-control"
                          :time-picker-options="{
                            start: timePickerStart,
                            step: step,
                            end: timePickerEnd }"
                          :disabled="timeDisabled">
                          </date-picker>
                      </div>
                    </div>
                    <div class="submit-button">
                      <button class="btn btn-common" id="form-submit" type="submit">
                        Schedule
                      </button>
                      <div id="msgSubmit" class="h3 text-center hidden"></div>
                      <div class="clearfix"></div>
                    </div>
                  </div>
                </form>
                <div v-else>
                  <b-alert variant="success" show>
                    <h4 class="alert-heading">Thank you!</h4>
                    <p>We will contact you regarding our call.</p>
                  </b-alert>
                </div>
              </div>
              </u-animate>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-12">
              <u-animate
                name="fadeIn"
                delay="0.4s"
                :iteration="1"
                :offset="0"
                animateClass="animated"
              >
              <div class="contact-right-area" v-if="seller">
                <h2>Get In Touch</h2>
                <div class="contact-right">
                  <div class="single-contact">
                    <div class="contact-icon">
                      <i class="lni-envelope"></i>
                    </div>
                    <p><a :href="'mailto:' + seller.email" target="_blank">{{ seller.email }}</a></p>
                  </div>
                  <div class="single-contact">
                    <div class="contact-icon">
                      <i class="lni-phone-handset"></i>
                    </div>
                    <p>
                      <a :href="'skype:' + seller.skype + '?add'">Skype {{ seller.name.first + ' ' + seller.name.last }}</a>
                    </p>
                  </div>
                </div>
              </div>
              </u-animate>
          </div>
        </div>
    </div>
  </section>
  <section id="contact" class="section-padding" v-else>
    <div class="container">
      <div class="row contact-form-area">
        <div class="col-md-6 col-lg-6 col-sm-12">
          Seller not found
        </div>
      </div>
    </div>
  </section>
</u-animate-container>
</template>

<style>
h2 {
  margin-bottom: 20px !important;
}
.error #errors {
  margin-bottom: 20px;
  }
  #errors li {
    color: red;
  }
  #errors li:first-letter {
    text-transform: capitalize;
  }
[time-picker-options] .mx-calendar-header {
  display: none;
}
#currentDate {
  font-weight: bold;
  display: block;
  margin-bottom: 20px;
}
</style>

<script>
import Menu from '@/components/Menu'
import {settings} from '../../config/settings'
import DatePicker from 'vue2-datepicker/lib/datepicker.js'
import moment from 'moment-timezone'
import {UAnimateContainer, UAnimate} from 'vue-wow'
import { mapState } from 'vuex'

let startTime = settings.startTime
let endTime = settings.endTime
let step = settings.timeStep
let timezone = moment.tz.guess()
let dateNow = moment(Date.now()).format('YYYY-MM-DD')
let locale = require('browser-locale')()

export default {
  components: { DatePicker, UAnimateContainer, UAnimate, Menu },
  computed: {
    ...mapState([
      'seller' // coming from store
    ]),
    firstDayOfWeek: () => {
      let firstDayOfWeek = moment.localeData(locale).firstDayOfWeek()
      return firstDayOfWeek === 0 ? 7 : firstDayOfWeek
    },
    timeFormat: () => {
      return settings.timeFormats12hour.indexOf(locale.split('-')[1].toLowerCase()) !== -1
        ? 'hh:mm a' : 'HH:mm'
    },
    dateFormat: () => {
      return typeof settings.dateFormats[locale] !== 'undefined'
        ? settings.dateFormats[locale] : 'DD.MM.YYYY'
    },
    timePickerStart: () => {
      return moment(dateNow + ' ' + startTime + ':00').tz(timezone).format('HH:mm')
    },
    timePickerEnd: () => {
      return moment(dateNow + ' ' + endTime + ':00').tz(timezone).format('HH:mm')
    }
  },
  data () {
    return {
      timeDisabled: true,
      step: step,
      settings: settings,
      timezone: timezone,
      tomorrow: moment(dateNow).add(1, 'day'),
      saved: false,
      startTime: '',
      error: false,
      errorMessages: [],
      input: {
        name: {
          first: '',
          last: ''
        },
        seller: '',
        email: '',
        startDate: '',
        startTime: ''
      },
      response: ''
    }
  },
  methods: {
    dateChanged () {
      this.timeDisabled = true

      if (this.input.startDate) {
        this.$http.get(settings.apiUrl + 'schedule/upcoming', { headers: { 'content-type': 'application/json' } }).then((result) => {
          let response = result.data
          this.timeDisabled = false
          let selectedDate = moment(this.input.startDate).tz(timezone).format('YYYY-MM-DD')
          let times = []
          if (response.schedules.length) {
            response.schedules.forEach(scheduleItem => {
              if (moment(scheduleItem.startDate).format('YYYY-MM-DD') === selectedDate) {
                times[times.length] = moment('1970-01-01 ' + scheduleItem.startTime).tz(timezone).format('HH:mm')
              }
            })
          }

          this.$nextTick(() => {
            [...this.$el.querySelectorAll('.mx-panel-time .mx-time-list')].forEach(el => {
              // getting all the selected times for the given date
              let elements = el.querySelectorAll('.mx-time-picker-item')
              if (elements.length) {
                elements.forEach(element => {
                  element.removeAttribute('disabled')
                  // convert times to local timezone
                  // get all dates, compare to the local date
                  let time = element.textContent
                  // the am/pm case
                  if (time.substring(' ')) {
                    time = time.split(' ')[0]
                  }
                  if (times.includes(time)) {
                    element.setAttribute('disabled', true)
                  }
                })
              }
            })
          })
        }, (error) => {
          this.error = true
          this.errorMessages = ['Error loading the scheduled times']
          console.error(error)
        })
      }
    },
    dateCleared () {
      this.timeDisabled = true
    },
    saveSchedule () {
      this.input.startTime = this.startTime === '' ? '' : moment(this.startTime).tz(settings.companyTimezone).format('HH:mm')
      this.input.seller = this.$store.state.seller.id
      this.$http.post(settings.apiUrl + 'schedule', this.input, { headers: { 'content-type': 'application/json' } }).then((result) => {
        this.response = result.data
        this.saved = true
        this.error = false
      }, (error) => {
        this.error = true
        this.errorMessages = error.body.errors
      })
    }
  }
}
</script>
