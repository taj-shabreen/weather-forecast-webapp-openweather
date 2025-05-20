from flask import render_template, request, send_from_directory
from app import app
from app.utils.weather_api import get_weather_data

@app.route('/static/animations/<path:filename>')
def static_files(filename):
    return send_from_directory('static/animations', filename)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        city = request.form.get('city', '').strip()
        country = request.form.get('country', '').strip()

        if not city or not country:
            error_message = "Please enter both city and country."
            return render_template('index.html', error=error_message)

        weather_data = get_weather_data(city, country)

        if weather_data:
            return render_template('result.html', forecast_data=weather_data, city_name=city.title())
        else:
            return render_template('error.html', error="Could not fetch weather data. Please try again.")

    # GET request
    return render_template('index.html', background_class='default-bg')
