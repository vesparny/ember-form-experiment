import ls from '../utils/localStorage';
import Ember from 'ember';

// the initial form status
// not sure this is the way to handle app state in ember
// maybe better to use ember data or an ember object ?
let initialModel = {
  name: '',
  description: '',
  images: []
};

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
    this.form = ls.retrieve('form') || initialModel;
  },

  onFileLoaded(img, e) {
    img.base64EncodedDataURL = e.target.result;
      this.get('form.images').pushObject(img);
      ls.persist('form', this.get('form'));
  },

  actions: {
    submit() {
      if (confirm('Are you sure you want to save?')) {
        const formData = new FormData();
        // send the form status to the server
        // there the base64 representation of the images may be parsed properly
        formData.append('data', JSON.stringify(this.get('form')));
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/my-fake-backend-endpoint');
        xhr.onload = () => {
          // reset the form with initial data
          this.set('form', initialModel);
          ls.persist('form', this.get('form'));
          alert('fake upload completed');
        };
        xhr.send(formData);
      }
    },

    persist(e) {
      const files = e.target.files;
      if (files) {
        // if the change is triggered by a file upload
        // process every file and save it as base64
        // this way we can serialize it ti localStorage
        for (let i = 0; i< files.length; i++) {
          const reader = new FileReader();
          // keep track of the file name
          let img = {
            name: files[i].name
          };
          reader.onload = this.onFileLoaded.bind(this, img);
          // load file as base64 data URL
          reader.readAsDataURL(files[i]);
        }
        // reset the input
        e.target.value = '';
      } else {
        // just save the form to localStorage
          ls.persist('form', this.get('form'));
      }
    }
  }
});
