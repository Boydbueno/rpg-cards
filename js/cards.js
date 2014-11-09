// ============================================================================
// Card definition related functions
// ============================================================================
function card_default_options() {
    return {
        default_color: "black",
        default_icon: "ace",
        default_title_size: "13",
        page_size: "A4",
        page_rows: 3,
        page_columns: 3,
        card_arrangement: "doublesided",
        card_size: "25x35",
        card_count: null,
        icon_inline: true
    }
}

function card_default_data() {
    return {
        count: 1,
        title: "New card",
        contents: []
    }
}

// ============================================================================
// Card definition related functions
// ============================================================================

function card_data_color_front(card_data, options) {
    return card_data.color_front || card_data.color || options.default_color || "black";
}

function card_data_color_back(card_data, options) {
    return card_data.color_back || card_data.color || options.default_color || "black";
}

function card_data_icon_front(card_data, options) {
    return card_data.icon_front || card_data.icon || options.default_icon || "ace";
}

function card_data_icon_back(card_data, options) {
    return card_data.icon_back || card_data.icon || options.default_icon || "ace";
}

function card_data_split_params(value) {
    return value.split("|").map(function (str) { return str.trim(); });
}

// ============================================================================
// Card element generating functions
// ============================================================================

function card_element_title(card_data, options) {
    var title = card_data.title || "";
    var title_size = card_data.title_size || options.default_title_size || 'normal';
    return '<div class="card-title card-title-' + title_size + '">' + title + '</div>';
}

function card_element_icon(card_data, options) {
    var icon = card_data_icon_front(card_data, options);
    var classname = "icon";
    if (options.icon_inline) {
        classname = "inlineicon";
    }

    var result = "";
    result += '<div class="card-title-' + classname + '-container">';
    result += '    <div class="card-title-' + classname + ' icon-' + icon + '">';
    result += '    </div>';
    result += '</div>';
    return result;
}

function card_element_subtitle(params, card_data, options) {
    var subtitle = params[0] || "";
    return '<div class="card-element card-subtitle">' + subtitle + '</div>';
}

function card_element_ruler(params, card_data, options) {
    var color = card_data_color_front(card_data, options);
    var fill = 'fill="' + color + '"';
    var stroke = 'stroke="' + color + '"';

    var result = "";
    result += '<svg class="card-ruler" height="1" width="100" viewbox="0 0 100 1" preserveaspectratio="none" xmlns="http://www.w3.org/2000/svg">';
    result += '    <polyline points="0,0 100,0.5 0,1" ' + fill + '></polyline>';
    result += '</svg>';
    return result;
}

function card_element_property(params, card_data, options) {
    var result = "";
    result += '<div class="card-element card-property-line">';
    result += '   <h4 class="card-property-name">' + params[0] + '</h4>';
    result += '   <p class="card-p card-property-text">' + params[1] + '</p>';
    result += '</div>';
    return result;
}

function card_element_description(params, card_data, options) {
    var result = "";
    result += '<div class="card-element card-description-line">';
    result += '   <h4 class="card-description-name">' + params[0] + '</h4>';
    result += '   <p class="card-p card-description-text">' + params[1] + '</p>';
    result += '</div>';
    return result;
}

function card_element_text(params, card_data, options) {
    var result = "";
    result += '<div class="card-element card-description-line">';
    result += '   <p class="card-p card-description-text">' + params[0] + '</p>';
    result += '</div>';
    return result;
}

function card_element_bullet(params, card_data, options) {
    var result = "";
    result += '<ul class="card-element card-bullet-line">';
    result += '   <li class="card-bullet">' + params[0] + '</li>';
    result += '</ul>';
    return result;
}

function card_element_section(params, card_data, options) {
    var color = card_data_color_front(card_data, options);
    var section = params[0] || "";
    return '<h3 class="card-section" style="color:' + color + '">' + section + '</h3>';
}

function card_element_fill(params, card_data, options) {
    var flex = params[0] || "1";
    return '<span class="card-fill" style="flex:' + flex + '"></span>';
}

function card_element_unknown(params, card_data, options) {
    return '<div>Unknown element: ' + params.join('<br />') + '</div>';
}

function card_element_empty(params, card_data, options) {
    return '';
}

var card_element_generators = {
    subtitle: card_element_subtitle,
    property: card_element_property,
    rule: card_element_ruler,
    ruler: card_element_ruler,
    description: card_element_description,
    text: card_element_text,
    bullet: card_element_bullet,
    fill: card_element_fill,
    section: card_element_section,
    disabled: card_element_empty
};

// ============================================================================
// Card generating functions
// ============================================================================

function card_generate_contents(contents, card_data, options) {
    var result = "";
    result += '<div class="card-content-container">';
    result += contents.map(function (value) {
        var parts = card_data_split_params(value);
        var element_name = parts[0];
        var element_params = parts.splice(1);
        var element_generator = card_element_generators[element_name];
        if (element_generator) {
            return element_generator(element_params, card_data, options);
        } else if (element_name.length > 0) {
            return card_element_unknown(element_params, card_data, options);
        }
    }).join("\n");
    result += '</div>';
    return result;
}

function card_repeat(card, count) {
    var result = [];
    for (var i = 0; i < count; ++i) {
        result.push(card);
    }
    return result;
}

function card_generate_color_style(color, options) {
    return 'style="color:' + color + '; border-color:' + color + '; background-color:' + color + '"';
}

function card_generate_color_gradient_style(color, options) {
    return 'style="background: radial-gradient(ellipse at center, white 20%, ' + color + ' 120%)"';
}

function card_generate_front(data, options) {
    var color = card_data_color_front(data, options);
    var style_color = card_generate_color_style(color, options);

    var result = "";
    result += '<div class="card card-size-' + options.card_size + '" ' + style_color + '>';
    result += card_element_icon(data, options);
    result += card_element_title(data, options);
    result += card_generate_contents(data.contents, data, options);
    result += '</div>';

    return result;
}

function card_generate_back(data, options) {
    var color = card_data_color_back(data, options)
    var style_color = card_generate_color_style(color, options);
    var style_gradient = card_generate_color_gradient_style(color, options);
    var icon = card_data_icon_back(data, options);

    var result = "";
    result += '<div class="card card-size-' + options.card_size + '" ' + style_color + '>';
    result += '  <div class="card-back" ' + style_gradient + '>';
    result += '    <div class="card-back-inner">';
    result += '      <div class="card-back-icon icon-' + icon + '" ' + style_color + '></div>';
    result += '    </div>';
    result += '  </div>';
    result += '</div>';

    return result;
}

function card_generate_empty(count, options) {
    var style_color = card_generate_color_style("white");

    var result = "";
    result += '<div class="card card-size-' + options.card_size + '" ' + style_color + '>';
    result += '</div>';

    return card_repeat(result, count);
}

// ============================================================================
// Functions that generate pages of cards
// ============================================================================

function card_pages_split(data, rows, cols) {
    var cards_per_page = rows * cols;
    var result = [];
    for (var i = 0; i < data.length; i += cards_per_page) {
        var page = data.slice(i, i + cards_per_page);
        result.push(page);
    }
    return result;
}

function card_pages_merge(front_pages, back_pages) {
    var result = [];
    for (var i = 0; i < front_pages.length; ++i) {
        result.push(front_pages[i]);
        result.push(back_pages[i]);
    }
    return result;
}

function cards_pages_flip_left_right(cards, rows, cols) {
    var result = [];
    for (var r = 0; r < rows; ++r) {
        for (var c = 0; c < cols; ++c) {
            var i = r*cols + (cols-1-c);
            result.push(cards[i]);
        }
    }
    return result;
}

function card_pages_add_padding(cards, options) {
    var cards_per_page = options.page_rows * options.page_columns;
    var last_page_cards = cards.length % cards_per_page;
    if (last_page_cards !== 0) {
        return cards.concat(card_generate_empty(cards_per_page - last_page_cards, options));
    } else {
        return cards;
    }
}

function card_pages_interleave_cards(front_cards, back_cards, options) {
    var result = [];
    var i = 0;
    while (i < front_cards.length) {
        result.push(front_cards[i]);
        result.push(back_cards[i]);
        if (options.page_columns > 2) {
            result.push(card_generate_empty(options.page_columns - 2, options));
        }
        ++i;
    }
    return result;
}

function card_pages_wrap(pages, options) {
    var size = options.page_size || "A4";

    var result = "";
    for (var i = 0; i < pages.length; ++i) {
        var style = "";
        if ((options.card_arrangement == "doublesided") &&  (i % 2 == 1)) {
            style += 'style="background-color:'+options.default_color+'"';
        }
        result += '<page class="page page-preview" size="' + size + '" ' + style + '>\n';
        result += pages[i].join("\n");
        result += '</page>\n';
    }
    return result;
}

function card_pages_generate_style(options) {
    var size = "a4";
    switch (options.page_size) {
        case "A3": size = "A3 portrait"; break;
        case "A4": size = "210mm 297mm"; break;
        case "A5": size = "A5 portrait"; break;
        case "Letter": size = "letter portrait"; break;
        case "25x35": size = "2.5in 3.5in"; break;
        default: size = "auto";
    }

    var result = "";
    result += "<style>\n";
    result += "@page {\n";
    result += "    margin: 0;\n";
    result += "    size:" + size + ";\n";
    result += "    -webkit-print-color-adjust: exact;\n";
    result += "}\n";
    result += "</style>\n";
    return result;
}

function card_pages_generate_html(card_data, options) {
    options = options || card_default_options();
    var rows = options.page_rows || 3;
    var cols = options.page_columns || 3;

    // Generate the HTML for each card
    var front_cards = [];
    var back_cards = [];
    card_data.forEach(function (data) {
        var count = options.card_count || data.count || 1;
        var front = card_generate_front(data, options);
        var back = card_generate_back(data, options);
        front_cards = front_cards.concat(card_repeat(front, count));
        back_cards = back_cards.concat(card_repeat(back, count));
    });

    var pages = [];
    if (options.card_arrangement == "doublesided") {
        // Add padding cards so that the last page is full of cards
        front_cards = card_pages_add_padding(front_cards, options);
        back_cards = card_pages_add_padding(back_cards, options);

        // Split cards to pages
        var front_pages = card_pages_split(front_cards, rows, cols);
        var back_pages = card_pages_split(back_cards, rows, cols);

        // Shuffle back cards so that they line up with their corresponding front cards
        back_pages = back_pages.map(function (page) {
            return cards_pages_flip_left_right(page, rows, cols);
        });

        // Interleave front and back pages so that we can print double-sided
        pages = card_pages_merge(front_pages, back_pages);
    } else if (options.card_arrangement == "front_only") {
        var cards = card_pages_add_padding(front_cards, options);
        pages = card_pages_split(cards, rows, cols);
    } else if (options.card_arrangement == "side_by_side") {
        var cards = card_pages_interleave_cards(front_cards, back_cards, options);
        cards = card_pages_add_padding(cards, options);
        pages = card_pages_split(cards, rows, cols);
    }

    // Wrap all pages in a <page> element and add CSS for the page size
    var result = "";
    result += card_pages_generate_style(options);
    result += card_pages_wrap(pages, options);

    return result;
}

function card_pages_insert_into(card_data, container) {

    // Clear the previous content of the document
    while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }

    // Insert the HTML
    var html = card_pages_generate_html(card_data);
    container.innerHTML = html;
}
