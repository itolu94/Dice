'use strict';

$(document).ready(function() {
    var noted,
        listing,
        index;

    // get notes for the saved jobs
    $.getJSON('/jobs/save/notes', function(data) {
        noted = data;
    });


    // appends notes for jobs posting 
    var findNotes = function(index) {
        $('#notes').html('');
        // add error handling for no notes
        var jobNotes = noted[index].notes;
        if (jobNotes.length === 0) {
            console.log('No Notes Added')
        } else {
            for (var i = 0; i < jobNotes.length; i++) {
                var button = $('<button>')
                    .addClass('deleteNote')
                    .append('Delete Me');
                var div = $('<div>')
                    .addClass('note');
                var p = $('<p>')
                    .addClass('deleteNote noteText')
                    .append(jobNotes[i]);
                div.append(p, button);
                // var note = '<p>' + jobNotes[i] + '</p>';
                $('#notes').append(div);
            }
        }
    }


    // saves job posting to mongodb
    $('.save').on('click', function() {
        listing = $(this).attr('listing'),
            job = {};
        job.position = $('#position' + listing).text(),
            job.description = $('#description' + listing).text(),
            job.location = $('#location' + listing).text(),
            job.link = $('#link' + listing).attr('href');
        $.ajax({
            method: 'post',
            url: '/jobs/save',
            dataType: 'json',
            data: job,
        })
    });

    // delete saved job 
    $('.delete').on('click', function() {
        var id = $(this).attr('listing');
        var deletePost = { 'post': id };
        $.ajax({
            method: 'delete',
            url: 'jobs/save',
            dataType: 'json',
            data: deletePost
        })

        $(this).closest('.listing').remove();
    })

    // adds a note to saved job posting
    $('.addNote').on('click', function() {
        var id = $(this).attr('listing')
        listing = id
        for (var i = 0; i < noted.length; i++) {
            if (id === noted[i]._id) {
                index = i;
                findNotes(index);
                break;
            };
        };
    });

    // adds a new note to job posting
    $('#newNote').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/open-application/note',
            data: { id: noted[index]._id, note: $('#noteText').val() }
        })
    });


    $(document).on('click', '.deleteNote', function() {
        var noteText = {
            id: listing,
            note: $(this).siblings().text()
        };
        console.log(noteText);
        $.ajax({
            method: 'delete',
            url: 'open-application/note',
            dataType: 'json',
            data: noteText
        })
    })



    $('.modal').modal().css({ 'height': '40%' });
});
