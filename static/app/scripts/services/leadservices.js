
var leadservices = angular.module('crmEngine.leadservices',[]);

leadservices.factory('Lead', function($http) {

  var Lead = function(data) {
    angular.extend(this, data);
  }

  Lead.get = function($scope,params) {
          $scope.isLoading = true;
          $scope.getColaborators()
          $scope.$apply();
          gapi.client.crmengine.leads.getv2(params).execute(function(resp) {
            if(!resp.code){
               $scope.lead = resp;
               console.log(resp);
                 $scope.getColaborators();
               $scope.isContentLoaded = true;
               $scope.renderMaps();
               var renderMap = false;
                if (resp.infonodes){
                    if (resp.infonodes.items){
                        for (var i=0;i<resp.infonodes.items.length;i++)
                        {
                          if (resp.infonodes.items[i].kind == 'addresses'){
                            renderMap = true;
                          }
                            $scope.infonodes[resp.infonodes.items[i].kind] = resp.infonodes.items[i].items;
                            for (var j=0;j<$scope.infonodes[resp.infonodes.items[i].kind].length;j++)
                              {
                                for (var v=0;v<$scope.infonodes[resp.infonodes.items[i].kind][j].fields.length;v++)
                                  {
                                    $scope.infonodes[resp.infonodes.items[i].kind][j][$scope.infonodes[resp.infonodes.items[i].kind][j].fields[v].field] = $scope.infonodes[resp.infonodes.items[i].kind][j].fields[v].value;
                                    $scope.infonodes[resp.infonodes.items[i].kind][j]['entityKey'] = $scope.infonodes[resp.infonodes.items[i].kind][j].entityKey;
                                  }
                              }
                        }

                    }
                }
                if (resp.topics){
                    if (params.topics.pageToken){
                       angular.forEach(resp.topics.items, function(item){
                           $scope.topics.push(item);
                       });
                    }
                    else{
                        $scope.topics = resp.topics.items;
                    }

                    if ($scope.topicCurrentPage >1){
                        console.log('Should show PREV');
                      $scope.topicpagination.prev = true;
                    }else{
                        $scope.topicpagination.prev= false;
                     }
                   if (resp.topics.nextPageToken){
                     var nextPage = $scope.topicCurrentPage + 1;
                      // Store the nextPageToken
                     $scope.topicpages[nextPage] = resp.topics.nextPageToken;
                     $scope.topicpagination.next = true;

                     }else{
                    $scope.topicpagination.next = false;
                   }
                  }
                  if (resp.documents){
                      if (!resp.documents.items){
                        $scope.blankStatdocuments = true;
                      }
                      if (params.documents.pageToken){
                         angular.forEach(resp.documents.items, function(item){
                             $scope.documents.push(item);
                         });
                      }
                      else{
                          $scope.documents = resp.documents.items;
                      }
                      if ($scope.documentCurrentPage >1){
                          $scope.documentpagination.prev = true;
                      }else{
                           $scope.documentpagination.prev = false;
                      }
                     if (resp.documents.nextPageToken){

                       var nextPage = $scope.documentCurrentPage + 1;
                       // Store the nextPageToken
                       $scope.documentpages[nextPage] = resp.documents.nextPageToken;
                       $scope.documentpagination.next = true;

                     }else{
                      $scope.documentpagination.next = false;
                     }
                  }

                  if (resp.tasks){
                     $scope.tasks = resp.tasks.items;
                  }else{
                    $scope.tasks = [];
                  }

                  if (resp.events){
                     $scope.events = resp.events.items;
                  }else{
                    $scope.events = [];  
                  }
                // $scope.listTopics(resp);
                // $scope.listTasks();
                // $scope.listEvents();
                // $scope.listDocuments();
                // $scope.listInfonodes();

                //$scope.renderMaps();
                $scope.email.to = '';
                if (resp.profile_img_url){
                  $scope.imageSrc=resp.profile_img_url;
                }else{
                  $scope.imageSrc='/static/img/avatar_contact.jpg';
                }

                document.title = "Lead: " + $scope.lead.firstname +' '+ $scope.lead.lastname ;
                var invites = new Array();
                angular.forEach($scope.infonodes.emails, function(value, key){
                  var inviteOnHangoutByEmail = { 'id' : value.email, 'invite_type' : 'EMAIL' };
                  invites.push(inviteOnHangoutByEmail);
                  $scope.email.to = $scope.email.to + value.email + ',';
                });

                gapi.hangout.render('placeholder-div1', {
                  'render': 'createhangout',
                  'invites':invites
                });
                $scope.isLoading = false;
                $scope.renderMaps();
                $scope.getLinkedinProfile();
               // Call the method $apply to make the update on the scope
               $scope.$apply();
               if (resp.topics && !params.topics.pageToken){
                    $scope.hilightTopic();
                };
                // if (resp.tasks){
                //     $scope.hilightTask();
                // }
                // if (resp.events){
                //     $scope.hilightEvent();
                // }
            }else {
               if(resp.code==401){
                // $scope.refreshToken();
                console.log(resp);
                $scope.isLoading = false;
                $scope.$apply();
               };
            }
            console.log('gapi #end_execute');
          });
  }; 
  Lead.get_linkedin= function($scope,params) {
          $scope.isLoading = true;
          
          gapi.client.crmengine.people.getLinkedin(params).execute(function(resp) {
            if(!resp.code){
             $scope.linkedProfile.firstname=resp.firstname;
             $scope.linkedProfile.lastname=resp.lastname;
             $scope.linkedProfile.headline=resp.headline;
             $scope.linkedProfile.formations=resp.formations
             $scope.linkedProfile.locality=resp.locality;
             $scope.linkedProfile.relation=resp.relation;
             $scope.linkedProfile.industry=resp.industry;
             $scope.linkedProfile.resume=resp.resume;
             $scope.linkedProfile.skills=resp.skills;
             $scope.linkedProfile.current_post=resp.current_post;
             $scope.linkedProfile.past_post=resp.past_post;
             $scope.linkedProfile.certifications=JSON.parse(resp.certifications);
             $scope.linkedProfile.experiences=JSON.parse(resp.experiences);

             $scope.isLoading = false;
             $scope.$apply();
              console.log($scope.linkedProfile);
              console.log(resp)
            }else {
               if(resp.code==401){
                // $scope.refreshToken();
               
                $scope.isLoading = false;
                $scope.$apply();
               };
            }
            console.log('gapi #end_execute');
          });
          $scope.isLoading = false;
  };

    Lead.get_twitter= function($scope,params) {
          $scope.isLoading = true;
          gapi.client.crmengine.people.gettwitter(params).execute(function(resp) {
            if(!resp.code){
             $scope.twitterProfile.id=resp.id;
             $scope.twitterProfile.followers_count=resp.followers_count;
             $scope.twitterProfile.last_tweet_text=resp.last_tweet_text;
             $scope.twitterProfile.last_tweet_favorite_count=resp.last_tweet_favorite_count;
             $scope.twitterProfile.last_tweet_retweeted=resp.last_tweet_retweeted;
             $scope.twitterProfile.last_tweet_retweet_count=resp.last_tweet_retweet_count;
             $scope.twitterProfile.language=resp.language;
             $scope.twitterProfile.created_at=resp.created_at;
             $scope.twitterProfile.nbr_tweets=resp.nbr_tweets;
             $scope.twitterProfile.description_of_user=resp.description_of_user;
             $scope.twitterProfile.friends_count=resp.friends_count;
             $scope.twitterProfile.name=resp.name;
             $scope.twitterProfile.screen_name=resp.screen_name;
             $scope.twitterProfile.url_of_user_their_company=resp.url_of_user_their_company;
             $scope.twitterProfile.location=resp.location;
             $scope.twitterProfile.profile_image_url_https=resp.profile_image_url_https;
             $scope.twitterProfile.lang=resp.lang;



             $scope.isLoading = false;
             $scope.$apply();
              console.log($scope.twitterProfile);
              console.log(resp);
            }else {
               if(resp.code==401){
                // $scope.refreshToken();
               console.log(resp);
                $scope.isLoading = false;
                $scope.$apply();
               };
            }
            console.log('gapi #end_execute');
          });
          $scope.isLoading = false;
  };

  Lead.patch = function($scope,params) {
          console.log('in leads.patch service');
          $scope.isLoading=true;
          gapi.client.crmengine.leads.patch(params).execute(function(resp) {
            console.log(params);
            console.log(resp);
            if(!resp.code){
                for (var k in params){
                 if (k!='id'&&k!='entityKey'){
                   $scope.lead[k] = resp[k];
                 }
               }
               $scope.email.to = '';
                angular.forEach($scope.lead.emails, function(value, key){
                  $scope.email.to = $scope.email.to + value.email + ',';

                });
               $scope.isLoading=false;
               // Call the method $apply to make the update on the scope
                $scope.$apply();

            }else {
               if(resp.code==401){
                $scope.refreshToken();
                $scope.isLoading = false;
                $scope.$apply();
               };
            }
            console.log('leads.patch gapi #end_execute');
          });
  };
  Lead.list = function($scope,params){
     $scope.isLoading = true;
      gapi.client.crmengine.leads.listv2(params).execute(function(resp) {

              if(!resp.code){
                if (!resp.items){
                    if(!$scope.isFiltering){
                        $scope.blankStatelead = true;
                    }
                  }
                 $scope.leads = resp.items;
                  if ($scope.currentPage>1){
                      $scope.leadpagination.prev = true;
                   }else{
                       $scope.leadpagination.prev = false;
                   }
                 if (resp.nextPageToken){
                   var nextPage = $scope.currentPage + 1;
                   // Store the nextPageToken
                   $scope.pages[nextPage] = resp.nextPageToken;
                   $scope.leadpagination.next = true;

                 }else{
                  $scope.leadpagination.next = false;
                 }
                 // Call the method $apply to make the update on the scope
                 $scope.isLoading = false;
                 $scope.$apply();


              }else {
                if(resp.code==401){
                $scope.refreshToken();
                $scope.isLoading = false;
                $scope.$apply();
               };
              }
              console.log('gapi #end_execute');
        });



  };
    Lead.listMore = function($scope,params){
     $scope.isMoreItemLoading = true;
     $( window ).trigger( "resize" );
     $scope.$apply();
      gapi.client.crmengine.leads.listv2(params).execute(function(resp) {
              if(!resp.code){

                  angular.forEach(resp.items, function(item){
                      $scope.leads.push(item);
                  });
                  if ($scope.currentPage>1){
                      $scope.leadpagination.prev = true;
                   }else{
                       $scope.leadpagination.prev = false;
                   }
                 if (resp.nextPageToken){
                   var nextPage = $scope.currentPage + 1;
                   // Store the nextPageToken
                   $scope.pages[nextPage] = resp.nextPageToken;
                   $scope.leadpagination.next = true;

                 }else{
                  $scope.leadpagination.next = false;
                 }
                 // Call the method $apply to make the update on the scope
                 $scope.isMoreItemLoading = false;
                 $scope.$apply();



              }else {
                if(resp.code==401){
                $scope.refreshToken();
                $scope.isMoreItemLoading = false;
                $scope.$apply();
               };
              }
        });

  };
  Lead.insert = function($scope,lead){
      $scope.isLoading = true;
      gapi.client.crmengine.leads.insertv2(lead).execute(function(resp) {

         if(!resp.code){
          $scope.isLoading = false;

          $scope.leadInserted();
          $scope.$apply();

         }else{
            console.log(resp.message);
             $('#addLeadModal').modal('hide');
             $('#errorModal').modal('show');
             if(resp.message=="Invalid grant"){
                $scope.refreshToken();
                $scope.isLoading = false;
                $scope.$apply();
             };
         }
      });
  };
  Lead.convert = function($scope,id){
      $scope.isLoading = true;
      gapi.client.crmengine.leads.convertv2(id).execute(function(resp) {

         if(!resp.code){
          $scope.isLoading = false;
          $('#convertLeadModal').modal('hide');
          window.location.replace('#/contacts/show/'+resp.id);

         }else{
            console.log(resp.message);
             $('#addLeadModal').modal('hide');
             $('#errorModal').modal('show');
             if(resp.message=="Invalid grant"){
                console.log(resp);
                $scope.isLoading = false;
                $scope.$apply();
             };
         }
      });
  };


 Lead.delete = function($scope,params){
    console.log(params);
    gapi.client.crmengine.leads.delete(params).execute(function(resp){
        console.log('i am in delete');
        console.log(resp);
        window.location.replace('#/leads');
      }
    )};

  Lead.search = function($scope,params){
      gapi.client.crmengine.leads.search(params).execute(function(resp) {
          console.log(resp);
           if (resp.items){
              $scope.results = resp.items;

              $scope.$apply();
            };

      });
  };


return Lead;
});


// retrieve a contact
contactservices.factory('LeadLoader', ['Lead', '$route', '$q',
    function(Lead, $route, $q) {
  return function() {
    var delay = $q.defer();

    var leadId = $route.current.params.leadId;


    return Lead.get($route.current.params.leadId);
  };
}]);


accountservices.factory('Email', function() {

  var Email = function(data) {
    angular.extend(this, data);
  };

  Email.send = function($scope,params){
      $scope.isLoading = true;
      $scope.sending = true;
      console.log("spasssssssssssssss");
      console.log(params);
      gapi.client.crmengine.emails.send(params).execute(function(resp) {

            $('#sendingEmail').modal('show');
            if(!resp.code){
             console.log('email sent thank youleaddd');
             $scope.emailSent= true;
             $scope.sending = false;
             $scope.selectedTab = 1;
             $scope.listTopics();
             $scope.email = {};
             $scope.$apply();

             $('#sendingEmail').modal('hide');


            }else{
               console.log(resp.message);


               $('#errorModal').modal('show');
               if(resp.code==401){
                  $scope.refreshToken();
                  $scope.isLoading = false;
                  $scope.$apply();
               };
         }
     });

  };



return Email;
});
