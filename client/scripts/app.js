var App = {

  $spinner: $('.spinner img'),

  username: 'anonymous',

  initialize: function() {
    App.username = window.location.search.substr(10);

    FormView.initialize();
    RoomsView.initialize();
    MessagesView.initialize();

    // Fetch initial batch of messages
    App.startSpinner();
    App.fetch(App.stopSpinner);


    // Poll for new messages every 3 sec
    setInterval(App.fetch, 3000);
  },

  fetch: function(callback = ()=>{}) {
    Parse.readAll((data) => {
      const parsedData = JSON.parse(data);
      var shapedData = [];

      for (var i = 0; i < parsedData.length; i++) {
        var dataSet = {
          text: parsedData[i].message_text,
          username: parsedData[i].username,
          roomname: parsedData[i].room_name
        };
        shapedData.push(dataSet);
      }

      console.log(shapedData);
      // Don't bother to update if we have no messages
      if (!shapedData || !shapedData.length) {
        callback();
        return;
      }

      Rooms.update(shapedData, RoomsView.render);
      Messages.update(shapedData, MessagesView.render);

      callback();
    });
  },

  startSpinner: function() {
    App.$spinner.show();
    FormView.setStatus(true);
  },

  stopSpinner: function() {
    App.$spinner.fadeOut('fast');
    FormView.setStatus(false);
  }
};
