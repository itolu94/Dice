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
    var findNotes = function(notes) {
        // add error handling for no notes
        if (notes.length === 0) {
            console.log('No Notes Added');
        } else if (typeof notes === 'string') {
            var button = $('<button>')
                .addClass('deleteNote')
                .append('Delete Me');
            var div = $('<div>')
                .addClass('note');
            var p = $('<p>')
                .addClass('deleteNote noteText')
                .append(notes);
            div.append(p, button);
            $('#notes').append(div);
        } else {
            console.log('im in here...')
            for (var i = 0; i < notes.length; i++) {
                var button = $('<button>')
                    .addClass('deleteNote')
                    .append('Delete Me');
                var div = $('<div>')
                    .addClass('note');
                var p = $('<p>')
                    .addClass('deleteNote noteText')
                    .append(notes[i]);
                div.append(p, button);
                $('#notes').append(div);
            }

        }
    }



    // saves job posting to mongodb
    $('.save').on('click', function() {
        var job = {};
        listing = $(this).attr('listing');
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
                var jobNotes = noted[i].notes;
                console.log(jobNotes)
                $('#notes').html('');
                findNotes(jobNotes);
                break;
            };
        };
    });

    // adds a new note to job posting
    $('#newNote').on('submit', function(e) {
        e.preventDefault();
        var newNote = $('#noteText').val(),
            saveNote = { id: listing, note: newNote }
        $.ajax({
            method: 'post',
            url: '/open-application/note',
            data: saveNote
        })
        findNotes(newNote);
    });


    $(document).on('click', '.deleteNote', function() {
        var noteText = {
            id: listing,
            note: $(this).siblings().text()
        };
        $.ajax({
            method: 'delete',
            url: 'open-application/note',
            dataType: 'json',
            data: noteText
        })
        $(this).closest('.note').remove();

    })



    $('.modal').modal().css({ 'height': '500px' });
});
